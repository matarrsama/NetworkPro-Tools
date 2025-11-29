# NetworkPro Tools - System Architecture

## Application Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ELECTRON MAIN PROCESS                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      main.ts                                 │  │
│  │  • Window Creation & Management                             │  │
│  │  • Menu Setup                                               │  │
│  │  • App Lifecycle Events                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              IPC Handlers (ipc-handlers.ts)                 │  │
│  │                                                              │  │
│  │  • IP Calculator Logic      • DNS Resolution               │  │
│  │  • Port Scanner             • Network Diagnostics          │  │
│  │  • WHOIS Lookup            • MAC Resolution                │  │
│  │  • Settings Management      • Network Info Gathering       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              System Command Execution                        │  │
│  │                                                              │  │
│  │  Windows Commands:        Node.js APIs:                     │  │
│  │  • ping                   • dns module                       │  │
│  │  • tracert                • net module                       │  │
│  │  • netstat                • os module                        │  │
│  │  • arp                    • child_process                    │  │
│  │  • whois                                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↑                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │ (IPC - Preload Bridge)
                               │
┌──────────────────────────────┼───────────────────────────────────────┐
│                         RENDERER PROCESS                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              preload.ts (Secure Bridge)                     │  │
│  │                                                              │  │
│  │  Context Isolation: Exposes only necessary IPC methods     │  │
│  │  • calculateIPRange()      • resolveDNS()                   │  │
│  │  • scanPorts()             • ping()                         │  │
│  │  • getMACAddress()         • getNetworkInfo()               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              React Application (App.tsx)                    │  │
│  │                                                              │  │
│  │  • State Management        • Router/Navigation              │  │
│  │  • Theme Management        • Error Handling                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Navigation Component                      │  │
│  │  ┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │  │
│  │  │  Dashboard  │ │ IP Calc  │ │DNS Tools │ │Port Scanner│  │  │
│  │  └─────────────┘ └──────────┘ └──────────┘ └────────────┘  │  │
│  │  ┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │  │
│  │  │  Network    │ │  Whois   │ │   MAC    │ │ Diagnostics│  │  │
│  │  │   Info      │ │ Lookup   │ │ Address  │ │            │  │  │
│  │  └─────────────┘ └──────────┘ └──────────┘ └────────────┘  │  │
│  │  ┌─────────────┐                                             │  │
│  │  │  Settings   │                                             │  │
│  │  └─────────────┘                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   UI Components                              │  │
│  │  • Form Inputs         • Data Tables                         │  │
│  │  • Buttons            • Result Cards                         │  │
│  │  • Status Indicators  • Error Messages                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Styling (App.css)                         │  │
│  │  • Dark/Light Themes   • Responsive Design                  │  │
│  │  • CSS Variables       • Animations & Transitions            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  HTML DOM (index.html)                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
                        ┌──────────────┐
                        │   Windows    │
                        │  10 / 11     │
                        └──────────────┘
```

## Data Flow Example: IP Calculator

```
User Input (IP + CIDR)
        ↓
React Component (IPCalculator.tsx)
    • State: ipInput, cidrInput
    • Click: "Calculate"
        ↓
IPC Invoke
    window.electronAPI.calculateIPRange(ip, cidr)
        ↓
Preload Bridge
    ipcRenderer.invoke('calculateIPRange', ip, cidr)
        ↓
Main Process IPC Handler
    ipcMain.handle('calculateIPRange', handler)
        ↓
Handler Function
    • Parse IP octets
    • Calculate network address
    • Calculate broadcast address
    • Calculate host count
        ↓
Return Result Object
    { network, broadcast, netmask, hostCount, cidr }
        ↓
IPC Response (Promise resolve)
        ↓
Preload Bridge (pass through)
        ↓
React Component (receive result)
        ↓
Update State
    setResult(res)
        ↓
Re-render Component
        ↓
Display Results in UI
```

## Component Hierarchy

```
App (Root)
│
├── Navigation
│   ├── Dashboard (menu item)
│   ├── IP Calculator
│   ├── DNS Tools
│   ├── Network Diagnostics
│   ├── Port Scanner
│   ├── Network Info
│   ├── WHOIS Lookup
│   ├── MAC Address Tools
│   └── Settings
│
└── Main Content
    ├── Page Component (dynamic)
    │   ├── Card
    │   │   ├── Form Group
    │   │   │   ├── Input Fields
    │   │   │   └── Buttons
    │   │   └── Result Display
    │   │       ├── Tables
    │   │       ├── Grids
    │   │       └── Status Messages
    │   │
    │   └── Info Card
    │       ├── Descriptions
    │       └── Instructions
```

## File Organization

```
src/
│
├── main.ts                    [MAIN PROCESS]
│   • Electron app setup
│   • Window creation
│   • Menu configuration
│   • App lifecycle
│
├── preload.ts                 [IPC BRIDGE]
│   • Context isolation
│   • API exposure
│   • IPC method mappings
│
├── ipc-handlers.ts            [BACKEND LOGIC]
│   • All handler implementations
│   • System command execution
│   • Data processing
│   • Error handling
│
├── App.tsx                    [MAIN COMPONENT]
│   • State management
│   • Routing logic
│   • Theme management
│   • Page rendering
│
├── App.css                    [STYLING]
│   • Theme definitions
│   • Component styles
│   • Responsive design
│   • Animations
│
├── index.tsx                  [ENTRY POINT]
│   • React DOM render
│   • App initialization
│
├── components/
│   └── Navigation.tsx         [NAVIGATION]
│       • Menu items
│       • Navigation logic
│       • Active state
│
└── pages/
    ├── Dashboard.tsx          [PAGE 1]
    ├── IPCalculator.tsx       [PAGE 2]
    ├── DNSTools.tsx           [PAGE 3]
    ├── NetworkDiagnostics.tsx [PAGE 4]
    ├── PortScanner.tsx        [PAGE 5]
    ├── NetworkInfo.tsx        [PAGE 6]
    ├── WhoisLookup.tsx        [PAGE 7]
    ├── MACAddressTools.tsx    [PAGE 8]
    └── Settings.tsx           [PAGE 9]
```

## IPC Communication Pattern

```
Frontend (Renderer)                 Backend (Main)
─────────────────────────────────────────────────

User clicks button
    ↓
React State updates
    ↓
Event handler runs
    ↓
Call IPC method
window.electronAPI.ping('8.8.8.8', 4)
    ├─────────────────────────────────→
                                   ipcRenderer.invoke()
                                   Preload Bridge
                                       ↓
                                   ipcMain.handle()
                                       ↓
                                   Handler executes
                                   exec('ping 8.8.8.8 -n 4')
                                       ↓
                                   Parse output
                                       ↓
                                   Return result
    ←─────────────────────────────────
Promise resolves
    ↓
setResult(response)
    ↓
Component re-renders
    ↓
Display results to user
```

## Security Boundaries

```
TRUSTED (Node.js/System)
┌─────────────────────────────────────┐
│  Main Process                       │
│  • File system access               │
│  • System command execution         │
│  • Network operations               │
│  • Configuration management         │
└─────────────────────────────────────┘
         ↑ Secure IPC (Preload)
         │ (Only exposed methods)
         ↓
┌─────────────────────────────────────┐
│  Renderer Process (Sandboxed)       │
│  • React UI                         │
│  • User interactions                │
│  • Limited API access               │
│  • No direct system access          │
└─────────────────────────────────────┘
         ↓ User Events
UNTRUSTED (User Input)
```

## Technology Stack Visualization

```
                    NETWORKPRO TOOLS
                          │
                ┌─────────┼─────────┐
                │         │         │
           FRONTEND    BACKEND    SYSTEM
             (UI)      (Logic)   (Commands)
             │         │         │
          React ─→ TypeScript ← Electron
             │         │         │
          CSS     IPC Handlers   Node.js
             │         │         │
            DOM    Windows API   PowerShell
```

## Theme System

```
document.documentElement
    └── data-theme="dark"/"light"
            │
            ├─→ CSS Variables
            │   ├── --bg-primary
            │   ├── --text-primary
            │   ├── --accent-color
            │   └── ... (20+ variables)
            │
            └─→ Computed Styles
                ├── Component backgrounds
                ├── Text colors
                ├── Border colors
                └── All UI elements
```

## Settings Persistence

```
User Action in Settings
        ↓
React State Update
        ↓
Click "Save"
        ↓
window.electronAPI.saveSettings(settings)
        ↓
IPC invoke to main
        ↓
Write to JSON file
~/.networkpro-tools.json
        ↓
Success response
        ↓
Update React state
        ↓
Show success message
```

---

This architecture ensures:
- ✅ Secure IPC communication
- ✅ Modular component design
- ✅ Clean separation of concerns
- ✅ Easy to extend and maintain
- ✅ Professional desktop app experience

---

For detailed code documentation, see **DEVELOPER.md**
