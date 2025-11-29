# NetworkPro Tools - Quick Start Cheat Sheet

## ⚡ 2-Minute Setup

```powershell
cd "c:\Users\matar\OneDrive\Documents\my app"
npm install
npm run build
npm start
```

**Done!** App launches automatically.

## 🎮 First Time Tips

### On First Launch
1. **Dashboard** appears - shows system info
2. Navigate using **sidebar menu**
3. Try each **tool one by one**
4. Go to **Settings** to customize

### Quick Tests
- **IP Calculator**: Try `192.168.0.0` with CIDR `24`
- **DNS Tools**: Resolve `google.com`
- **Ping**: Ping `8.8.8.8` (4 packets)
- **Port Scanner**: Scan `127.0.0.1` ports `80-443`

## 📋 Common Tasks

### Calculate Subnet
1. Open **IP Calculator**
2. Enter IP: `10.0.0.0`
3. Enter CIDR: `8`
4. Click **Calculate CIDR**
5. See: Network, Broadcast, Host count

### Find Open Ports
1. Open **Port Scanner**
2. Enter Host: `127.0.0.1`
3. Ports: `1` to `1000`
4. Click **Scan Ports**
5. View **Open Ports** list

### Check Network Connection
1. Open **Network Diagnostics**
2. **Ping** a host
3. See response time
4. Or use **Traceroute** to see path

### View Network Adapters
1. Open **Network Info**
2. See all **Network Interfaces**
3. View IPv4, IPv6, MAC addresses
4. Check **System Details**

## 🔌 Development Commands

| Command | What It Does |
|---------|------------|
| `npm install` | Install all dependencies |
| `npm run build` | Compile TypeScript → JavaScript |
| `npm start` | Run the app |
| `npm run dev` | Run with DevTools (debugging) |
| `npm run watch` | Auto-compile on file changes |
| `npm run dist` | Create installer & portable EXE |

## 🗂️ Key Files & Folders

| Location | Purpose |
|----------|---------|
| `src/` | All source code |
| `src/main.ts` | App startup & window |
| `src/ipc-handlers.ts` | All tool logic |
| `src/pages/` | Individual tools |
| `dist/` | Compiled output |
| `public/index.html` | HTML template |
| `package.json` | Dependencies |

## 🎨 Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Ctrl+Q` | Quit app |
| `Ctrl+R` | Reload (dev mode) |
| `F12` | DevTools (dev mode) |

## 🆘 Quick Fixes

**App won't start?**
```powershell
npm run build
npm start
```

**Needs dependencies?**
```powershell
npm install
```

**Want to develop?**
```powershell
npm run dev
```

**Build for distribution?**
```powershell
npm run dist
```

## 📚 Where to Find Answers

| Question | Look Here |
|----------|-----------|
| How to install? | `SETUP.md` |
| How to code? | `DEVELOPER.md` |
| How to use? | `README.md` |
| Full details? | `PROJECT_SUMMARY.md` |
| This file? | You're reading it! |

## 💾 Settings File Location

```
C:\Users\[YourUsername]\.networkpro-tools.json
```

Contains:
- Theme preference
- Tool settings
- DNS servers
- Refresh intervals

## 🚀 Tips for Power Users

### Speed Up Port Scans
1. Go to **Settings**
2. Lower "Port Scan Timeout"
3. Default: 5000ms (5 sec) → Try 2000ms (2 sec)

### Enable Auto-Refresh
1. **Settings**
2. Check "Enable Auto Refresh"
3. Set interval (5000ms = 5 seconds)

### Custom DNS
1. Edit `.networkpro-tools.json`
2. Change `defaultDNS` array
3. Example: `["1.1.1.1", "8.8.8.8"]`

### Night Mode Always
1. Open **Settings**
2. Check "Dark Mode"
3. Settings save automatically

## 🎯 Most Used Tools

### For IP Planning
→ **IP Calculator** (CIDR, subnet calculations)

### For Troubleshooting
→ **Network Diagnostics** (ping, traceroute)

### For Device Discovery
→ **Network Info** (see all adapters)

### For Security Audit
→ **Port Scanner** (find open ports)

### For DNS Issues
→ **DNS Tools** (forward & reverse lookup)

## ⚠️ Important Notes

- **Admin Required**: Some tools need Administrator privileges
- **Network Access**: Requires internet for DNS/Whois
- **Windows Only**: Electron app for Windows (currently)
- **Local Processing**: No data sent to cloud
- **Persistent**: Settings auto-save

## 🔄 Update App

```powershell
# Pull latest code (if using git)
git pull

# Rebuild
npm run build

# Run
npm start
```

## 📦 Create Installer

```powershell
npm run dist
```

Creates:
- `NetworkPro Tools Setup.exe` (installer)
- `NetworkPro Tools.exe` (portable)

Both in `dist/` folder

## 🐛 Report a Bug

When reporting issues, include:
1. What tool were you using?
2. What input did you provide?
3. What was the error?
4. Windows version?
5. Error message (F12 → Console)

## 💪 Getting Started with Code

### Edit a Tool
1. Open `src/pages/[ToolName].tsx`
2. Edit React component
3. Run `npm run build`
4. See changes in app

### Edit Styling
1. Open `src/App.css`
2. Modify CSS
3. Reload app (Ctrl+R in dev mode)

### Add New Tool
1. Create `src/pages/NewTool.tsx`
2. Add handler in `src/ipc-handlers.ts`
3. Expose in `src/preload.ts`
4. Add to navigation
5. Update router in `src/App.tsx`

## 📊 System Requirements

| Item | Requirement |
|------|------------|
| OS | Windows 10+ |
| RAM | 512MB minimum |
| Disk | 300MB (with dependencies) |
| Node.js | v16+ |
| npm | v7+ |

## 🎓 Learning Path

### Beginner
1. Read `README.md`
2. Follow `SETUP.md`
3. Run the app
4. Try each tool

### Intermediate
1. Read `DEVELOPER.md`
2. Look at `src/pages/` files
3. Understand component structure
4. Modify existing tool

### Advanced
1. Study `src/ipc-handlers.ts`
2. Add new tool from scratch
3. Contribute improvements
4. Build custom extensions

## 🎯 Common Settings

### For Slow Network
```json
{
  "pingCount": 4,
  "portScanTimeout": 5000,
  "tracerouteHops": 15
}
```

### For Fast Network
```json
{
  "pingCount": 1,
  "portScanTimeout": 2000,
  "tracerouteHops": 30
}
```

### For Development
```json
{
  "theme": "dark",
  "autoRefresh": false,
  "notifications": true
}
```

## 🏁 You're All Set!

```
✅ App installed
✅ Ready to use
✅ Docs available
✅ Tools working
```

**Next Steps**: Pick a tool and get to work!

---

**Quick Links**:
- 📖 Full Guide: `README.md`
- 🔧 Developer Guide: `DEVELOPER.md`  
- 📋 Setup Guide: `SETUP.md`
- 📊 Project Info: `PROJECT_SUMMARY.md`

**Happy networking!** 🚀
