# NetworkPro Tools - Developer Quick Reference

## Quick Start Commands

```powershell
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run app with DevTools
npm run dev

# Run compiled app
npm start

# Watch TypeScript for changes
npm run watch

# Create distribution packages
npm run dist
```

## File Locations & Purposes

| File | Purpose |
|------|---------|
| `src/main.ts` | Electron main process, window creation, menu |
| `src/preload.ts` | IPC API bridge to renderer process |
| `src/ipc-handlers.ts` | All network tool implementations |
| `src/App.tsx` | Main React component, routing |
| `src/App.css` | Global styles, themes, responsive design |
| `src/index.tsx` | React entry point |
| `src/components/Navigation.tsx` | Sidebar navigation |
| `src/pages/*.tsx` | Individual tool components |
| `public/index.html` | HTML entry point |
| `package.json` | Dependencies and build scripts |
| `tsconfig.json` | TypeScript compiler settings |

## Adding a New Network Tool

### 1. Create Page Component
Create `src/pages/NewTool.tsx`:
```tsx
import React, { useState } from 'react';

const NewTool = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleAction = async () => {
    const res = await (window as any).electronAPI.newTool(input);
    setResult(res);
  };

  return (
    <div className="page-container">
      <h2>🔧 New Tool</h2>
      <div className="card">
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={handleAction}>Execute</button>
      </div>
      {result && <div className="result-card">{JSON.stringify(result)}</div>}
    </div>
  );
};

export default NewTool;
```

### 2. Add IPC Handler
In `src/ipc-handlers.ts`:
```ts
const newTool = async (param: string) => {
  // Implementation
  return { result: 'data' };
};

export const setupIPCHandlers = () => {
  // ... existing handlers ...
  ipcMain.handle('newTool', (_, param: string) => newTool(param));
};
```

### 3. Add to Preload API
In `src/preload.ts`:
```ts
contextBridge.exposeInMainWorld('electronAPI', {
  // ... existing ...
  newTool: (param: string) => ipcRenderer.invoke('newTool', param),
});
```

### 4. Add Navigation Item
In `src/components/Navigation.tsx`:
```tsx
const menuItems = [
  // ... existing ...
  { id: 'new-tool', label: '🔧 New Tool', icon: '🔧' },
];
```

### 5. Update Router
In `src/App.tsx`:
```tsx
case 'new-tool':
  return <NewTool />;
```

## Key Concepts

### IPC (Inter-Process Communication)
- **Preload Bridge**: Secure channel between Electron and React
- **Invoke Pattern**: Call backend functions from frontend
- **Context Isolation**: Prevents direct window object access

### Styling
- **CSS Variables**: Dark/light theme support
- **Mobile Responsive**: Grid-based responsive layout
- **BEM Convention**: Block-Element-Modifier naming

### State Management
- Simple React hooks (useState, useEffect)
- No external state library needed
- Settings persisted to JSON file

## Common Patterns

### Async Operations with Loading
```tsx
const [loading, setLoading] = useState(false);

const doWork = async () => {
  setLoading(true);
  try {
    const result = await (window as any).electronAPI.someFunction();
    setResult(result);
  } finally {
    setLoading(false);
  }
};

// Use in JSX
<button disabled={loading}>{loading ? 'Working...' : 'Execute'}</button>
```

### Error Handling
```tsx
{result && result.error && (
  <div className="error">{result.error}</div>
)}

{result && !result.error && (
  <div className="result-card">{/* Display result */}</div>
)}
```

### Form Input Group
```tsx
<div className="form-group">
  <input placeholder="Input 1" onChange={(e) => setVal1(e.target.value)} />
  <input placeholder="Input 2" onChange={(e) => setVal2(e.target.value)} />
  <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
</div>
```

## Styling Classes

```css
/* Layout */
.page-container      /* Main content wrapper */
.card               /* Content card */
.form-group         /* Form inputs group */
.button-group       /* Button group container */

/* Components */
.input-field        /* Text inputs */
.btn, .btn-primary, .btn-secondary /* Buttons */
.result-card        /* Result display */
.info-card          /* Information box */

/* Data Display */
.data-table         /* Data tables */
.result-grid        /* Result grid layout */
.interfaces-list    /* Interface list */
.ports-grid         /* Port display grid */

/* Status */
.status-ok          /* Success indicator */
.error              /* Error message */
.text-muted         /* Secondary text */
```

## Theme Variables

```css
/* Available in CSS */
--bg-primary        /* Main background */
--bg-secondary      /* Secondary background */
--bg-tertiary       /* Tertiary background */
--text-primary      /* Main text color */
--text-secondary    /* Secondary text color */
--border-color      /* Border color */
--accent-color      /* Primary accent */
--accent-hover      /* Accent hover state */
--success-color     /* Success color */
--error-color       /* Error color */
--warning-color     /* Warning color */
```

## Debugging

### Enable DevTools
In development:
```powershell
npm run dev
```

### Check Console Errors
- Press F12 to open DevTools
- Check "Console" tab for errors
- Check "Network" tab for failed requests

### Log from Main Process
```ts
console.log('Main process:', data); // Visible in terminal
```

### Log from Renderer Process
```tsx
console.log('Renderer:', data); // Visible in DevTools console
```

## Performance Tips

- Use `useCallback` for event handlers
- Minimize re-renders with proper dependencies
- Cache computed values
- Debounce expensive operations
- Use virtual lists for large data

## Build Issues

### Clear Cache
```powershell
npm cache clean --force
rm -r node_modules
npm install
npm run build
```

### TypeScript Errors
```powershell
npm run build -- --strict false  # Temporary workaround
```

## Package.json Scripts Explained

| Script | Purpose |
|--------|---------|
| `build` | Compile TypeScript to JavaScript |
| `start` | Run compiled application |
| `dev` | Run with DevTools enabled |
| `watch` | Compile on file changes |
| `pack` | Create uninstalledversion |
| `dist` | Create Windows installer & portable |

## Electron API Reference

### Common APIs
```ts
// Window management
BrowserWindow.create()
mainWindow.loadURL()
mainWindow.minimize()
mainWindow.maximize()

// IPC
ipcMain.handle()        // Backend
ipcRenderer.invoke()    // Frontend

// Menu
Menu.buildFromTemplate()
Menu.setApplicationMenu()
```

## React Hooks Reference

```tsx
// State
useState(initialValue)

// Side effects
useEffect(() => {}, [dependencies])

// Memoization
useCallback(() => {}, [dependencies])
useMemo(() => {}, [dependencies])
```

## Troubleshooting Development

| Issue | Solution |
|-------|----------|
| Changes not reflecting | Run `npm run build` |
| Module not found | Check import paths, run `npm install` |
| IPC method undefined | Check `preload.ts` and `ipc-handlers.ts` |
| Styles not loading | Check `App.css` path in `index.tsx` |
| App won't start | Check `main.ts` path to `dist/` folder |

## Useful Tools

- **VS Code**: Recommended editor with Electron extensions
- **TypeScript**: Type checking and autocompletion
- **Prettier**: Code formatter
- **ESLint**: Code linter

## Resources

- Electron: https://www.electronjs.org/docs
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Node.js: https://nodejs.org/docs/

---

**Happy Coding!** Keep utilities focused and user-friendly.
