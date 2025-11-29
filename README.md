# NetworkPro Tools - Professional Networking Utilities for Windows

A comprehensive Electron-based networking toolkit for network professionals. Packed with essential utilities for IP analysis, DNS lookups, network diagnostics, port scanning, and more.

![NetworkPro Tools](https://img.shields.io/badge/Electron-Latest-blue?style=flat-square)
![Windows](https://img.shields.io/badge/Platform-Windows-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square)

## Features

### 🔢 IP Calculator
- **CIDR Notation Calculator**: Convert between CIDR notation and traditional subnet masks
- **Subnet Calculations**: Calculate network address, broadcast address, host range
- **Network Planning**: Quick calculation of IP ranges and subnets

### 🌐 DNS Tools
- **Forward DNS Resolution**: Look up IP addresses for domain names
- **Reverse DNS Lookup**: Find domain names for IP addresses
- **Batch Operations**: Resolve multiple addresses

### 🔍 Network Diagnostics
- **Ping Utility**: Test host connectivity with customizable packet counts
- **Traceroute**: Trace the path packets take to a destination
- **Netstat**: View active network connections and listening ports
- **Real-time Monitoring**: Monitor network activity

### 📡 Port Scanner
- **Range Scanning**: Scan port ranges on target hosts
- **Quick Scan Presets**: Pre-configured scans for common services:
  - HTTP (80), HTTPS (443)
  - SSH (22), FTP (21)
  - DNS (53), DHCP (67, 68)
  - MySQL (3306), MSSQL (1433)
  - PostgreSQL (5432), RDP (3389)
  - And more...
- **Timeout Configuration**: Adjustable scan timeouts

### 🖥️ Network Information
- **System Details**: View hostname, platform, OS information
- **Network Interfaces**: Detailed interface configuration
- **MAC Addresses**: View all network adapter MAC addresses
- **IPv4 & IPv6 Support**: Display both address families

### 🏷️ MAC Address Tools
- **Local MAC Addresses**: Display all network adapter MAC addresses
- **MAC Resolution**: Resolve MAC addresses from IP addresses using ARP
- **Network Mapping**: Identify devices on your network

### 🔎 Whois Lookup
- **IP Ownership**: Find who owns an IP address
- **Registration Information**: Get registration dates and details
- **Geographic Location**: Identify IP location and organization

### ⚙️ Settings & Configuration
- **Dark/Light Mode**: Theme customization
- **Tool Settings**: Configure ping count, timeouts, and hop limits
- **Auto-refresh**: Enable automatic data refresh at intervals
- **DNS Configuration**: Set custom DNS servers
- **Notifications**: Toggle system notifications

## System Requirements

- **OS**: Windows 10 or later
- **Node.js**: v16 or later
- **npm**: v7 or later
- **Electron**: Latest stable version

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd "my app"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build TypeScript files:
   ```bash
   npm run build
   ```

## Usage

### Development Mode
Run the app with hot-reload and DevTools:
```bash
npm run dev
```

### Production Mode
Run the compiled app:
```bash
npm start
```

### Building a Distributable
Create a Windows installer and portable executable:
```bash
npm run dist
```

This generates installers in the `dist/` directory.

## Architecture

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Custom CSS with dark/light theme support
- **Components**: Modular React components for each tool

### Backend
- **Runtime**: Electron with Node.js
- **IPC**: Secure inter-process communication
- **OS Utilities**: Native Windows commands (ping, tracert, netstat, arp)

### Key Files
```
src/
├── main.ts              # Electron main process
├── preload.ts          # Preload script with secure IPC
├── ipc-handlers.ts     # All network utility handlers
├── App.tsx             # Main React component
├── App.css             # Application styling
├── components/
│   └── Navigation.tsx   # Navigation sidebar
└── pages/
    ├── Dashboard.tsx           # System overview
    ├── IPCalculator.tsx        # IP/subnet calculations
    ├── DNSTools.tsx            # DNS resolution
    ├── NetworkDiagnostics.tsx  # Ping, traceroute, netstat
    ├── PortScanner.tsx         # Port scanning
    ├── NetworkInfo.tsx         # Network interface details
    ├── WhoisLookup.tsx         # WHOIS lookups
    ├── MACAddressTools.tsx     # MAC address utilities
    └── Settings.tsx            # App settings
```

## Configuration

### Default Settings File
Settings are saved in: `~/.networkpro-tools.json`

```json
{
  "theme": "dark",
  "pingCount": 4,
  "portScanTimeout": 5000,
  "tracerouteHops": 30,
  "autoRefresh": false,
  "refreshInterval": 5000,
  "defaultDNS": ["8.8.8.8", "8.8.4.4"],
  "notifications": true
}
```

## Keyboard Shortcuts

- `Ctrl+Q` - Exit application
- `Ctrl+R` - Reload window
- `F12` - Toggle Developer Tools (Dev mode only)

## Security Considerations

- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ Sandbox enabled
- ✅ Secure IPC communication
- ✅ No remote content loading

## Troubleshooting

### Port Scanner Issues
- **Blocked ports**: Windows Firewall may block port scanning
- **Timeout errors**: Increase port scan timeout in settings
- **Target unreachable**: Verify network connectivity

### DNS Lookup Fails
- Verify your internet connection
- Check if DNS servers are reachable
- Try using different DNS servers in settings

### Whois Lookup Not Working
- Install whois utility via: `choco install whois`
- Or download whois.exe from alternative providers
- Run as Administrator if permissions issues occur

### Traceroute Timeout
- Increase the maximum hop limit in settings
- Some routers don't respond to traceroute
- May require Administrator privileges

## Performance Tips

- **Port scanning**: Increase timeout for slower networks
- **Batch operations**: Process one operation at a time
- **Network info**: Disable auto-refresh for low-resource systems
- **Large networks**: Adjust Netstat display to first 20 connections

## Development

### Project Structure
```
my app/
├── src/                    # TypeScript source files
├── dist/                   # Compiled JavaScript
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

### Building from Source
1. `npm install` - Install dependencies
2. `npm run build` - Compile TypeScript
3. `npm start` - Run the application
4. `npm run dist` - Create distribution packages

### Adding New Tools
1. Create a new page component in `src/pages/`
2. Add IPC handler in `src/ipc-handlers.ts`
3. Export handler in `src/preload.ts`
4. Add navigation item in `src/components/Navigation.tsx`
5. Update `src/App.tsx` routing

## License

MIT License - Feel free to use and modify as needed

## Support

For issues, feature requests, or contributions, please create an issue or pull request.

## Features Roadmap

- [ ] CIDR range validator
- [ ] Port service database lookup
- [ ] Packet capture and analysis
- [ ] Network monitoring dashboard
- [ ] Custom report generation
- [ ] Export results to CSV/PDF
- [ ] VPN detection
- [ ] Proxy detection
- [ ] Network speed test
- [ ] IP geolocation mapping
- [ ] SSL certificate checker
- [ ] HTTP header analyzer

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**NetworkPro Tools** - Making network administration easier, one tool at a time.
