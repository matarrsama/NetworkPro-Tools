# NetworkPro Tools - Setup & Installation Guide

## Prerequisites

Before getting started, ensure you have the following installed:

### Required Software
1. **Node.js** (v16 or later)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (v7 or later)
   - Usually comes with Node.js
   - Verify: `npm --version`

3. **Git** (optional but recommended)
   - For version control: https://git-scm.com/

## Installation Steps

### Step 1: Install Dependencies

Open PowerShell or Command Prompt in the project directory and run:

```powershell
npm install
```

This will install all required packages:
- **Electron**: Desktop application framework
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Electron-Builder**: For creating distributable packages

### Step 2: Build TypeScript

Compile TypeScript files to JavaScript:

```powershell
npm run build
```

This generates compiled files in the `dist/` directory.

### Step 3: Run the Application

Start the application:

```powershell
npm start
```

The NetworkPro Tools window should open automatically.

## Development Setup

For development with live reload:

```powershell
npm run dev
```

This opens the app with DevTools enabled, allowing you to:
- Inspect elements
- Debug JavaScript
- Check console logs
- Test Electron IPC

### Watch Mode

To automatically compile TypeScript changes:

```powershell
npm run watch
```

Keep this running in one terminal while you edit code.

## Building Distribution Packages

To create Windows installer and portable executables:

```powershell
npm run dist
```

This generates files in the `dist/` directory:
- `NetworkPro Tools Setup x.x.x.exe` - Windows installer
- `NetworkPro Tools x.x.x.exe` - Portable executable

## Project Structure Explained

```
my app/
│
├── src/                           # TypeScript source code
│   ├── main.ts                   # Electron main process (window, menu, lifecycle)
│   ├── preload.ts                # IPC API exposed to renderer
│   ├── ipc-handlers.ts           # All network utility implementations
│   ├── App.tsx                   # Main React component & router
│   ├── App.css                   # Application-wide styling
│   ├── index.tsx                 # React entry point
│   │
│   ├── components/
│   │   └── Navigation.tsx         # Sidebar navigation menu
│   │
│   └── pages/                     # Individual tool pages
│       ├── Dashboard.tsx          # System overview
│       ├── IPCalculator.tsx       # IP/CIDR calculations
│       ├── DNSTools.tsx           # DNS resolution
│       ├── NetworkDiagnostics.tsx # Ping, traceroute, netstat
│       ├── PortScanner.tsx        # Port range scanning
│       ├── NetworkInfo.tsx        # Interface details
│       ├── WhoisLookup.tsx        # WHOIS queries
│       ├── MACAddressTools.tsx    # MAC address utilities
│       └── Settings.tsx           # Application settings
│
├── dist/                          # Compiled JavaScript (auto-generated)
│
├── public/
│   └── index.html                # HTML entry point
│
├── package.json                   # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── .gitignore                    # Git ignore rules
├── README.md                     # User documentation
└── SETUP.md                      # This file


## Troubleshooting

### Common Issues

#### 1. npm install fails
**Solution**: Clear npm cache and try again
```powershell
npm cache clean --force
npm install
```

#### 2. Application won't start
**Check**: 
- Verify TypeScript compiled: `npm run build`
- Check for errors in console: `npm run dev`
- Restart the terminal and try again

#### 3. Port Scanner not working
- Windows Firewall may block port access
- Try scanning localhost (127.0.0.1) first
- Run as Administrator if needed

#### 4. Whois lookup errors
- Install whois utility:
  ```powershell
  choco install whois
  ```
  Or download whois.exe and add to PATH

#### 5. DNS resolution fails
- Check internet connection
- Verify DNS servers in settings
- Try different DNS servers (8.8.8.8, 1.1.1.1)

## First Run Checklist

After installation, verify everything works:

- [ ] Application opens without errors
- [ ] Dashboard loads system information
- [ ] Can navigate between all tabs
- [ ] Settings are accessible
- [ ] Dark/Light mode toggle works
- [ ] IP Calculator performs calculations
- [ ] DNS lookup works (test with google.com)
- [ ] Ping works (test with 8.8.8.8)

## Performance Optimization

For optimal performance:

1. **Close unnecessary background apps** to reduce system load
2. **Increase port scan timeout** for slower networks (Settings)
3. **Disable auto-refresh** if not needed (Settings)
4. **Clear netstat cache** periodically
5. **Update Windows** to latest version

## Advanced Configuration

### Custom DNS Servers

Edit `~/.networkpro-tools.json`:
```json
{
  "defaultDNS": ["1.1.1.1", "1.0.0.1"]
}
```

### Adjust Scan Timeouts

Edit settings in Settings tab or in JSON:
```json
{
  "portScanTimeout": 3000,
  "tracerouteHops": 20
}
```

### Theme Configuration

```json
{
  "theme": "dark"
}
```
Options: "dark" or "light"

## Network Requirements

- **Outbound connections** needed for:
  - DNS resolution (port 53)
  - Whois lookups (port 43)
  - API calls (ports 80, 443)

- **Local network access** for:
  - ARP queries (MAC address resolution)
  - Port scanning (target host)

## Security Notes

- Application runs with standard user privileges
- Some network commands (tracert, arp) may require Admin
- All data processing is local (no cloud uploads)
- Network requests are plain-text by default

## Updating the App

To update to the latest version:

1. Pull latest changes from repository
2. Run `npm install` to update dependencies
3. Run `npm run build` to compile
4. Run `npm start` to launch

## Uninstalling

### Remove via Windows Control Panel
1. Open Settings > Apps > Apps & Features
2. Find "NetworkPro Tools"
3. Click Uninstall

### Remove Completely
1. Uninstall via Control Panel
2. Delete the project folder
3. Delete settings: Remove `~/.networkpro-tools.json`

## Getting Help

If you encounter issues:

1. Check the [README.md](README.md) for feature documentation
2. Review error messages in DevTools (F12)
3. Check Windows Event Viewer for system errors
4. Verify prerequisites are installed
5. Try running as Administrator

## Additional Resources

- **Electron Documentation**: https://www.electronjs.org/docs
- **React Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Node.js Documentation**: https://nodejs.org/docs/

## Tips for Network Professionals

### IP Calculator
- Use CIDR notation for modern networks
- Common ranges: /24 (255), /16 (65,535), /8 (16M hosts)

### DNS Tools
- Test both forward and reverse DNS
- Good DNS hygiene = better network reliability

### Port Scanner
- Always get permission before scanning production networks
- Common ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3389 (RDP)

### Network Diagnostics
- Ping shows connectivity; traceroute shows path
- Netstat shows all active connections on your system
- Use these for troubleshooting connectivity issues

---

**Enjoy using NetworkPro Tools!** For questions or contributions, reach out to the development team.
