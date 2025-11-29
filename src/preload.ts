import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // IP Calculator
  calculateIPRange: (ip: string, cidr: number) =>
    ipcRenderer.invoke("calculateIPRange", ip, cidr),
  calculateSubnet: (ip: string, mask: string) =>
    ipcRenderer.invoke("calculateSubnet", ip, mask),

  // DNS Tools
  resolveDNS: (domain: string) => ipcRenderer.invoke("resolveDNS", domain),
  reverseDNS: (ip: string) => ipcRenderer.invoke("reverseDNS", ip),

  // Network Diagnostics
  ping: (host: string, count: number) =>
    ipcRenderer.invoke("ping", host, count),
  traceroute: (host: string) => ipcRenderer.invoke("traceroute", host),
  netstat: () => ipcRenderer.invoke("netstat"),

  // Port Scanner
  scanPorts: (host: string, startPort: number, endPort: number) =>
    ipcRenderer.invoke("scanPorts", host, startPort, endPort),

  // Network Info
  getNetworkInfo: () => ipcRenderer.invoke("getNetworkInfo"),
  getOpenPorts: () => ipcRenderer.invoke("getOpenPorts"),

  // Whois
  whois: (ip: string) => ipcRenderer.invoke("whois", ip),

  // MAC Address
  getMACAddress: () => ipcRenderer.invoke("getMACAddress"),
  resolveMACAddress: (ip: string) =>
    ipcRenderer.invoke("resolveMACAddress", ip),

  // Settings
  getSettings: () => ipcRenderer.invoke("getSettings"),
  saveSettings: (settings: any) => ipcRenderer.invoke("saveSettings", settings),

  // Network Configuration
  getNetworkAdapters: () => ipcRenderer.invoke("getNetworkAdapters"),
  configureNetworkAdapter: (config: any) =>
    ipcRenderer.invoke("configureNetworkAdapter", config),

  // WiFi Passwords
  getWiFiPasswords: () => ipcRenderer.invoke("getWiFiPasswords"),
  // Auto-updater
  onUpdateAvailable: (cb: () => void) => {
    ipcRenderer.on("update-available", () => cb());
  },
  onUpdateDownloaded: (cb: () => void) => {
    ipcRenderer.on("update-downloaded", () => cb());
  },
  onDownloadProgress: (cb: (progress: any) => void) => {
    ipcRenderer.on("download-progress", (_evt, progress) => cb(progress));
  },
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  installUpdate: () => ipcRenderer.invoke("install-update"),
});
