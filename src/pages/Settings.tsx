import React, { useState, useEffect } from "react";
import { useToasts } from "../components/Toast";

type SettingsProps = {
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
};

declare global {
  interface Window {
    ipcRenderer?: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      on: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode, setIsDarkMode }) => {
  const [settings, setSettings] = useState(null);
  const [localSettings, setLocalSettings] = useState(null);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const { addToast } = useToasts();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await (window as any).electronAPI.getSettings();
      setSettings(res);
      setLocalSettings(res);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    if (localSettings) {
      setLocalSettings({
        ...localSettings,
        [key]: value,
      });
    }
  };

  const saveSettings = async () => {
    try {
      await (window as any).electronAPI.saveSettings(localSettings);
      addToast("Settings saved successfully", "success");
    } catch (error) {
      console.error("Error saving settings:", error);
      addToast("Error saving settings", "error");
    }
  };

  const checkForUpdates = async () => {
    setCheckingUpdates(true);
    try {
      const result = await window.ipcRenderer?.invoke("check-for-updates");
      if (result?.error) {
        addToast(`Update check: ${result.error}`, "info");
      } else {
        addToast("Checking for updates...", "info");
      }
    } catch (error: any) {
      addToast(`Error checking updates: ${error?.message}`, "error");
    } finally {
      setCheckingUpdates(false);
    }
  };

  if (!localSettings) {
    return (
      <div className="page-container">
        <h2>⚙️ Settings</h2>
        <div className="card" style={{ textAlign: "center", padding: "30px" }}>
          <div className="loading"></div>
          <p style={{ marginTop: 12 }}>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>⚙️ Settings</h2>

      <div className="card">
        <h3>Appearance</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={(e) => setIsDarkMode(e.target.checked)}
            />
            Dark Mode
          </label>
        </div>
      </div>

      <div className="card">
        <h3>Network Tools Settings</h3>

        <div className="setting-item">
          <label>Ping Count:</label>
          <input
            type="number"
            value={localSettings.pingCount}
            onChange={(e) =>
              handleSettingChange("pingCount", parseInt(e.target.value))
            }
            className="input-field"
            min="1"
            max="100"
          />
        </div>

        <div className="setting-item">
          <label>Port Scan Timeout (ms):</label>
          <input
            type="number"
            value={localSettings.portScanTimeout}
            onChange={(e) =>
              handleSettingChange("portScanTimeout", parseInt(e.target.value))
            }
            className="input-field"
            min="1000"
            step="1000"
          />
        </div>

        <div className="setting-item">
          <label>Traceroute Max Hops:</label>
          <input
            type="number"
            value={localSettings.tracerouteHops}
            onChange={(e) =>
              handleSettingChange("tracerouteHops", parseInt(e.target.value))
            }
            className="input-field"
            min="1"
            max="255"
          />
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={localSettings.autoRefresh}
              onChange={(e) =>
                handleSettingChange("autoRefresh", e.target.checked)
              }
            />
            Enable Auto Refresh
          </label>
        </div>

        {localSettings.autoRefresh && (
          <div className="setting-item">
            <label>Refresh Interval (ms):</label>
            <input
              type="number"
              value={localSettings.refreshInterval}
              onChange={(e) =>
                handleSettingChange("refreshInterval", parseInt(e.target.value))
              }
              className="input-field"
              min="1000"
              step="1000"
            />
          </div>
        )}

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={localSettings.notifications}
              onChange={(e) =>
                handleSettingChange("notifications", e.target.checked)
              }
            />
            Enable Notifications
          </label>
        </div>
      </div>

      <div className="card">
        <h3>DNS Settings</h3>
        <div className="setting-item">
          <label>Default DNS Servers:</label>
          <textarea
            value={localSettings.defaultDNS?.join(", ")}
            onChange={(e) =>
              handleSettingChange(
                "defaultDNS",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
            className="input-field"
            rows={3}
          />
          <small>Separate DNS servers with commas</small>
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={saveSettings}>
          💾 Save Settings
        </button>
        <button className="btn btn-secondary" onClick={loadSettings}>
          🔄 Reset to Saved
        </button>
        <button
          className="btn btn-small"
          onClick={() => addToast("This is a test notification", "info")}
        >
          🔔 Test Notification
        </button>
        <button
          className="btn btn-small"
          onClick={checkForUpdates}
          disabled={checkingUpdates}
        >
          {checkingUpdates ? "⏳ Checking..." : "🔄 Check for Updates"}
        </button>
      </div>

      <div className="card info-card">
        <h3>💡 Settings Information</h3>
        <p>These settings customize the behavior of NetworkPro Tools.</p>
        <ul>
          <li>
            <strong>Dark Mode:</strong> Toggle between light and dark themes
          </li>
          <li>
            <strong>Ping Count:</strong> Number of packets to send in ping tests
          </li>
          <li>
            <strong>Port Scan Timeout:</strong> How long to wait for port
            responses
          </li>
          <li>
            <strong>Auto Refresh:</strong> Automatically refresh network data at
            intervals
          </li>
          <li>
            <strong>Notifications:</strong> Show desktop notifications for
            important events
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
