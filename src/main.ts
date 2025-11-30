import { app, BrowserWindow, Menu, ipcMain, dialog } from "electron";
import * as path from "path";
import { autoUpdater } from "electron-updater";
import { setupIPCHandlers } from "./ipc-handlers";

const isDev = process.env.NODE_ENV === "development";
let mainWindow: BrowserWindow | null = null;

// Configure auto-updater feed
if (!isDev) {
  autoUpdater.setFeedURL({
    provider: "github",
    owner: "matarrsama",
    repo: "NetworkPro-Tools",
  });
}

// Auto-updater configuration
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on("update-available", () => {
  console.log("Update available, downloading...");
  if (mainWindow) {
    mainWindow.webContents.send("update-available");
  }
});

// Emit download progress events to renderer so UI can show progress
autoUpdater.on("download-progress", (progressObj: any) => {
  try {
    if (mainWindow) {
      // progressObj typically includes: percent, transferred, total, bytesPerSecond
      mainWindow.webContents.send("download-progress", progressObj);
    }
  } catch (err) {
    console.error("Failed to send download-progress to renderer", err);
  }
});

autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded, prompting user...");
  if (mainWindow) {
    mainWindow.webContents.send("update-downloaded");
  }
  const choice = dialog.showMessageBoxSync(mainWindow!, {
    type: "question",
    buttons: ["Install Now", "Later"],
    title: "Update Ready",
    message: "A new version of NetworkPro Tools is ready to install.",
    detail: "The app will restart to install the update.",
  });
  if (choice === 0) {
    autoUpdater.quitAndInstall();
  }
});

autoUpdater.on("error", (error) => {
  console.error("Auto-updater error:", error);
  if (mainWindow) {
    mainWindow.webContents.send("update-error", error.message);
  }
});

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "../public/icon.ico"),
  });

  const startUrl = `file://${path.join(__dirname, "../dist/index.html")}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", () => {
  setupIPCHandlers();

  // Register IPC handlers for update controls
  ipcMain.handle("check-for-updates", async () => {
    try {
      if (isDev) return { error: "Development mode - updates disabled" };
      // This will trigger the autoUpdater events
      await autoUpdater.checkForUpdatesAndNotify();
      return { success: true };
    } catch (err: any) {
      return { error: err?.message || String(err) };
    }
  });

  ipcMain.handle("install-update", () => {
    try {
      autoUpdater.quitAndInstall();
      return { success: true };
    } catch (err: any) {
      return { error: err?.message || String(err) };
    }
  });

  createWindow();
  Menu.setApplicationMenu(null);

  // Check for updates after app is ready (with a small delay to let window load)
  if (!isDev) {
    setTimeout(() => {
      console.log("Checking for updates...");
      autoUpdater.checkForUpdatesAndNotify();
    }, 3000);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
