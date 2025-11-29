import { ipcMain } from 'electron';
import * as os from 'os';
import * as net from 'net';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as dns from 'dns';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);
const dnsLookup = promisify(dns.lookup);
const dnsReverse = promisify(dns.reverse);

const SETTINGS_FILE = path.join(os.homedir(), '.networkpro-tools.json');

// Load/Save Settings
const loadSettings = () => {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return getDefaultSettings();
};

const saveSettings = (settings: any) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

const getDefaultSettings = () => ({
  theme: 'dark',
  pingCount: 4,
  portScanTimeout: 5000,
  tracerouteHops: 30,
  autoRefresh: false,
  refreshInterval: 5000,
  defaultDNS: ['8.8.8.8', '8.8.4.4'],
  notifications: true,
});

// IP Calculator Functions
const calculateIPRange = (ip: string, cidr: number) => {
  try {
    const ipArray = ip.split('.').map(Number);
    
    // Convert IP to 32-bit integer
    const ipInt = (ipArray[0] << 24) | (ipArray[1] << 16) | (ipArray[2] << 8) | ipArray[3];
    
    // Create subnet mask
    const mask = (0xffffffff << (32 - cidr)) >>> 0;
    
    // Calculate network address
    const networkInt = ipInt & mask;
    const network = [
      (networkInt >>> 24) & 0xff,
      (networkInt >>> 16) & 0xff,
      (networkInt >>> 8) & 0xff,
      networkInt & 0xff,
    ];

    // Calculate broadcast address
    const broadcastInt = networkInt | (~mask >>> 0);
    const broadcast = [
      (broadcastInt >>> 24) & 0xff,
      (broadcastInt >>> 16) & 0xff,
      (broadcastInt >>> 8) & 0xff,
      broadcastInt & 0xff,
    ];

    // Calculate first and last usable hosts
    const firstHostInt = networkInt + 1;
    const firstHost = [
      (firstHostInt >>> 24) & 0xff,
      (firstHostInt >>> 16) & 0xff,
      (firstHostInt >>> 8) & 0xff,
      firstHostInt & 0xff,
    ];

    const lastHostInt = broadcastInt - 1;
    const lastHost = [
      (lastHostInt >>> 24) & 0xff,
      (lastHostInt >>> 16) & 0xff,
      (lastHostInt >>> 8) & 0xff,
      lastHostInt & 0xff,
    ];

    // Convert mask to dotted decimal notation
    const maskOctets = [
      (mask >>> 24) & 0xff,
      (mask >>> 16) & 0xff,
      (mask >>> 8) & 0xff,
      mask & 0xff,
    ];

    const hostCount = Math.pow(2, 32 - cidr) - 2;

    return {
      network: network.join('.'),
      broadcast: broadcast.join('.'),
      firstHost: firstHost.join('.'),
      lastHost: lastHost.join('.'),
      netmask: maskOctets.join('.'),
      hostCount,
      cidr,
    };
  } catch (error) {
    return { error: 'Invalid IP or CIDR' };
  }
};

const calculateSubnet = (ip: string, mask: string) => {
  try {
    const ipArray = ip.split('.').map(Number);
    const maskArray = mask.split('.').map(Number);
    
    // Convert IP and mask to 32-bit integers
    const ipInt = (ipArray[0] << 24) | (ipArray[1] << 16) | (ipArray[2] << 8) | ipArray[3];
    const maskInt = (maskArray[0] << 24) | (maskArray[1] << 16) | (maskArray[2] << 8) | maskArray[3];
    
    // Calculate network and broadcast
    const networkInt = ipInt & maskInt;
    const broadcastInt = networkInt | (~maskInt >>> 0);
    
    const network = [
      (networkInt >>> 24) & 0xff,
      (networkInt >>> 16) & 0xff,
      (networkInt >>> 8) & 0xff,
      networkInt & 0xff,
    ];
    
    const broadcast = [
      (broadcastInt >>> 24) & 0xff,
      (broadcastInt >>> 16) & 0xff,
      (broadcastInt >>> 8) & 0xff,
      broadcastInt & 0xff,
    ];
    
    // Count bits in mask to get CIDR
    const maskBits = maskArray.reduce((bits, octet) => bits + octet.toString(2).match(/1/g)?.length || 0, 0);
    const hostCount = Math.pow(2, 32 - maskBits) - 2;

    return {
      network: network.join('.'),
      broadcast: broadcast.join('.'),
      netmask: mask,
      hostCount,
      cidr: maskBits,
    };
  } catch (error) {
    return { error: 'Invalid IP or mask' };
  }
};

// DNS Functions
const resolveDNS = async (domain: string) => {
  try {
    const addresses = await dnsLookup(domain, { all: true });
    return {
      domain,
      addresses: addresses.map(addr => ({ address: addr.address, family: addr.family })),
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const reverseDNS = async (ip: string) => {
  try {
    const hostnames = await dnsReverse(ip);
    return { ip, hostnames };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Network Diagnostics
const ping = async (host: string, count: number = 4) => {
  try {
    const command = `ping -n ${count} ${host}`;
    const { stdout } = await execAsync(command);
    
    const lines = stdout.split('\n');
    const stats = lines.find(l => l.includes('Minimum'));
    
    if (stats) {
      const timeMatch = stats.match(/time[<>=\s]+(\d+)ms/gi);
      return {
        host,
        success: true,
        output: stdout,
        summary: stats,
      };
    }
    return { host, success: false, output: stdout };
  } catch (error: any) {
    return { error: error.message };
  }
};

const traceroute = async (host: string) => {
  try {
    const { stdout } = await execAsync(`tracert -h 30 ${host}`, { timeout: 30000 });
    return { host, output: stdout };
  } catch (error: any) {
    return { error: error.message };
  }
};

const netstat = async () => {
  try {
    const { stdout } = await execAsync('netstat -ano');
    const lines = stdout.split('\n').slice(4);
    const connections = lines
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          protocol: parts[0],
          localAddress: parts[1],
          remoteAddress: parts[2],
          state: parts[3],
          pid: parts[4],
        };
      });
    return { connections };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Port Scanner
const scanPorts = async (host: string, startPort: number, endPort: number) => {
  const openPorts = [];
  const timeout = 2000;

  for (let port = startPort; port <= endPort; port++) {
    try {
      const socket = new net.Socket();
      socket.setTimeout(timeout);
      
      await new Promise((resolve) => {
        socket.on('connect', () => {
          openPorts.push(port);
          socket.destroy();
          resolve(null);
        });
        
        socket.on('timeout', () => {
          socket.destroy();
          resolve(null);
        });
        
        socket.on('error', () => {
          resolve(null);
        });
        
        socket.connect(port, host);
      });
    } catch (error) {
      // Port not open
    }
  }

  return { host, startPort, endPort, openPorts };
};

// Network Info
const getNetworkInfo = () => {
  const interfaces = os.networkInterfaces();
  const info: any = {};

  for (const [name, addrs] of Object.entries(interfaces)) {
    info[name] = addrs?.map(addr => ({
      family: addr.family,
      address: addr.address,
      netmask: addr.netmask,
      mac: addr.mac,
      internal: addr.internal,
    }));
  }

  return {
    hostname: os.hostname(),
    platform: os.platform(),
    type: os.type(),
    interfaces: info,
  };
};

const getOpenPorts = async () => {
  try {
    const { stdout } = await execAsync('netstat -ano | find "LISTENING"');
    const ports = stdout
      .split('\n')
      .filter(line => line.includes('LISTENING'))
      .map(line => {
        const parts = line.split(/\s+/);
        const addressPort = parts[2];
        return addressPort.split(':').pop();
      })
      .filter(Boolean);
    
    return { openPorts: [...new Set(ports)] };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Whois lookup using web service (no external command required)
// Whois lookup using web service (no external command required)
const whois = async (ip: string) => {
  try {
    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return { error: 'Invalid IP address format' };
    }

    // Using ip-api.com for WHOIS information (free tier available)
    const https = require('https');
    
    return new Promise((resolve, reject) => {
      const url = `https://ip-api.com/json/${ip}?fields=status,query,country,city,isp,org,as,reverse`;
      
      https.get(url, (res: any) => {
        let data = '';
        
        res.on('data', (chunk: any) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.status === 'fail') {
              // API returned fail, use fallback
              fallbackWhois(ip).then(resolve).catch(() => {
                resolve({ 
                  error: `Could not find information for IP: ${ip}` 
                });
              });
            } else {
              resolve({ 
                ip,
                data: {
                  ip: result.query || ip,
                  country: result.country || 'Unknown',
                  city: result.city || 'Unknown',
                  isp: result.isp || 'Unknown',
                  organization: result.org || 'Unknown',
                  asn: result.as || 'Unknown',
                  reverse: result.reverse || 'Not available',
                  source: 'ip-api.com'
                }
              });
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', (err: any) => {
        // Fallback to nslookup if API fails
        fallbackWhois(ip).then(resolve).catch(() => {
          resolve({ 
            error: 'WHOIS lookup failed. Check your internet connection.' 
          });
        });
      });
    });
  } catch (error: any) {
    return { error: `WHOIS lookup failed: ${error.message}` };
  }
};

// Fallback WHOIS using nslookup and basic IP parsing
const fallbackWhois = async (ip: string) => {
  try {
    const { stdout } = await execAsync(`nslookup ${ip}`, { timeout: 5000 });
    return { 
      ip, 
      data: stdout,
      source: 'nslookup'
    };
  } catch (error: any) {
    // Return basic IP info as last resort
    const octets = ip.split('.');
    const firstOctet = parseInt(octets[0]);
    let range = 'Unknown';
    
    if (firstOctet >= 1 && firstOctet <= 9) range = 'Class A (1-9)';
    else if (firstOctet >= 10 && firstOctet <= 126) range = 'Class A (10-126)';
    else if (firstOctet >= 127 && firstOctet <= 191) range = 'Class B (127-191)';
    else if (firstOctet >= 192 && firstOctet <= 223) range = 'Class C (192-223)';
    else if (firstOctet >= 224 && firstOctet <= 239) range = 'Class D - Multicast (224-239)';
    else if (firstOctet >= 240 && firstOctet <= 255) range = 'Class E - Reserved (240-255)';
    
    return {
      ip,
      data: {
        ip: ip,
        organization: range,
        country: 'Unable to determine',
        isp: 'Unable to determine',
        source: 'basic-classification'
      }
    };
  }
};

// MAC Address Functions
const getMACAddress = () => {
  const interfaces = os.networkInterfaces();
  const macAddresses: any = {};

  for (const [name, addrs] of Object.entries(interfaces)) {
    macAddresses[name] = addrs?.[0]?.mac;
  }

  return macAddresses;
};

const resolveMACAddress = async (ip: string) => {
  try {
    const { stdout } = await execAsync(`arp -a ${ip}`);
    const match = stdout.match(/([0-9a-f]{2}(?::[0-9a-f]{2}){5})/i);
    return { ip, mac: match?.[0] || 'Not found' };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Network Configuration Functions
const getNetworkAdapters = () => {
  try {
    const interfaces = os.networkInterfaces();
    const adapters: any[] = [];

    for (const [name, addrs] of Object.entries(interfaces)) {
      if (!addrs) continue;
      
      const ipv4 = addrs.find(addr => addr.family === 'IPv4');
      const ipv6 = addrs.find(addr => addr.family === 'IPv6');

      adapters.push({
        name: name,
        description: name,
        ipv4: ipv4?.address,
        subnet: ipv4?.netmask,
        gateway: 'N/A', // Would need additional parsing
        dns1: 'N/A',
        dns2: 'N/A',
        dhcpEnabled: true, // Default, actual status requires WMI on Windows
        mac: addrs[0]?.mac,
      });
    }

    return adapters;
  } catch (error: any) {
    return { error: error.message };
  }
};

const configureNetworkAdapter = async (config: any) => {
  try {
    const { adapterName, useDHCP, ipAddress, subnetMask, gateway, dns1, dns2 } = config;

    // Windows command to configure network adapter
    if (useDHCP) {
      // Enable DHCP
      const cmd = `netsh interface ip set address name="${adapterName}" source=dhcp`;
      await execAsync(cmd, { timeout: 10000 });
      
      // Set DNS to DHCP
      const dnsCmd = `netsh interface ip set dnsservers name="${adapterName}" source=dhcp`;
      await execAsync(dnsCmd, { timeout: 10000 });

      return `Successfully configured "${adapterName}" to use DHCP`;
    } else {
      // Set static IP
      const ipCmd = `netsh interface ip set address name="${adapterName}" static ${ipAddress} ${subnetMask} ${gateway || ipAddress.split('.').slice(0, 3).join('.')}.1`;
      await execAsync(ipCmd, { timeout: 10000 });

      // Set DNS servers if provided
      if (dns1) {
        const dnsCmd = `netsh interface ip set dnsservers name="${adapterName}" static ${dns1}`;
        await execAsync(dnsCmd, { timeout: 10000 });

        if (dns2) {
          const dns2Cmd = `netsh interface ip add dnsservers name="${adapterName}" ${dns2}`;
          await execAsync(dns2Cmd, { timeout: 10000 });
        }
      }

      return `Successfully configured "${adapterName}" with static IP ${ipAddress}`;
    }
  } catch (error: any) {
    // More detailed error handling
    if (error.message.includes('Access Denied')) {
      return { error: 'Access Denied - Administrative privileges required' };
    }
    return { error: `Configuration failed: ${error.message}` };
  }
};

// WiFi Password Recovery
const getWiFiPasswords = async () => {
  try {
    // Windows command to get saved WiFi profiles
    const { stdout: profiles } = await execAsync('netsh wlan show profiles', { timeout: 10000 });
    
    const ssidMatches = profiles.match(/All User Profile\s*:\s*(.+)/gi) || [];
    const networks: any[] = [];

    for (const match of ssidMatches) {
      const ssid = match.replace(/All User Profile\s*:\s*/i, '').trim();
      
      if (!ssid || ssid === '') continue;

      try {
        // Get password for each profile
        const { stdout: profileData } = await execAsync(
          `netsh wlan show profile name="${ssid}" key=clear`,
          { timeout: 5000 }
        );

        // Extract security type
        const securityMatch = profileData.match(/Authentication\s*:\s*(.+)/i);
        const security = securityMatch ? securityMatch[1].trim() : 'Unknown';

        // Extract password
        const passwordMatch = profileData.match(/Key Content\s*:\s*(.+)/i);
        const password = passwordMatch ? passwordMatch[1].trim() : '(No password stored)';

        // Extract last connection time
        const lastConnectMatch = profileData.match(/Last connection time\s*:\s*(.+)/i);
        const lastConnected = lastConnectMatch ? lastConnectMatch[1].trim() : undefined;

        networks.push({
          ssid,
          password,
          security,
          lastConnected,
        });
      } catch (err) {
        // Skip profiles that can't be read
        console.error(`Could not read profile for ${ssid}:`, err);
      }
    }

    if (networks.length === 0) {
      return { 
        error: 'No WiFi profiles found. Ensure you have saved WiFi networks.',
        networks: []
      };
    }

    return { networks };
  } catch (error: any) {
    // Check for admin privilege issue
    if (error.message.includes('Access Denied')) {
      return { 
        error: 'Access Denied - Administrative privileges required to view WiFi passwords',
        networks: []
      };
    }
    return { 
      error: `Failed to retrieve WiFi passwords: ${error.message}`,
      networks: []
    };
  }
};

export const setupIPCHandlers = () => {
  // IP Calculator
  ipcMain.handle('calculateIPRange', (_, ip: string, cidr: number) =>
    calculateIPRange(ip, cidr)
  );
  
  ipcMain.handle('calculateSubnet', (_, ip: string, mask: string) =>
    calculateSubnet(ip, mask)
  );

  // DNS
  ipcMain.handle('resolveDNS', (_, domain: string) => resolveDNS(domain));
  ipcMain.handle('reverseDNS', (_, ip: string) => reverseDNS(ip));

  // Network Diagnostics
  ipcMain.handle('ping', (_, host: string, count: number) => ping(host, count));
  ipcMain.handle('traceroute', (_, host: string) => traceroute(host));
  ipcMain.handle('netstat', () => netstat());

  // Port Scanner
  ipcMain.handle('scanPorts', (_, host: string, startPort: number, endPort: number) =>
    scanPorts(host, startPort, endPort)
  );

  // Network Info
  ipcMain.handle('getNetworkInfo', () => getNetworkInfo());
  ipcMain.handle('getOpenPorts', () => getOpenPorts());

  // Whois
  ipcMain.handle('whois', (_, ip: string) => whois(ip));

  // MAC Address
  ipcMain.handle('getMACAddress', () => getMACAddress());
  ipcMain.handle('resolveMACAddress', (_, ip: string) => resolveMACAddress(ip));

  // Settings
  ipcMain.handle('getSettings', () => loadSettings());
  ipcMain.handle('saveSettings', (_, settings: any) => {
    saveSettings(settings);
    return { success: true };
  });

  // Network Configuration
  ipcMain.handle('getNetworkAdapters', () => getNetworkAdapters());
  ipcMain.handle('configureNetworkAdapter', (_, config: any) =>
    configureNetworkAdapter(config)
  );

  // WiFi Passwords
  ipcMain.handle('getWiFiPasswords', () => getWiFiPasswords());
};
