import React from "react";
import { useToasts } from "../components/Toast";

const About = () => {
  const { addToast } = useToasts();

  const checkUpdates = async () => {
    const api = (window as any).electronAPI;
    if (!api || !api.checkForUpdates) {
      addToast("Update check not available in this environment", "warning");
      return;
    }

    try {
      const res = await api.checkForUpdates();
      if (res && res.error) {
        addToast(`Update check failed: ${res.error}`, "error");
      } else {
        addToast("Checking for updates...", "info");
      }
    } catch (err: any) {
      addToast(`Update check failed: ${err?.message || String(err)}`, "error");
    }
  };
  return (
    <div className="page-container">
      <h2>ℹ️ About NetworkPro Tools</h2>

      <div className="card">
        <h3>Welcome to NetworkPro Tools</h3>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "16px",
            lineHeight: "1.6",
          }}
        >
          NetworkPro Tools is a comprehensive Windows utility designed to
          simplify network management and diagnostics. Whether you're managing
          IP addresses, scanning ports, analyzing DNS records, or
          troubleshooting network connectivity, this tool provides an intuitive
          interface to perform essential networking tasks.
        </p>
      </div>

      <div className="card">
        <h3>Features</h3>
        <ul style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
          <li>
            <strong>IP Calculator:</strong> Calculate CIDR notation and subnet
            masks with detailed network information
          </li>
          <li>
            <strong>Port Scanner:</strong> Scan ports with customizable ranges
            and quick preset scans
          </li>
          <li>
            <strong>DNS Tools:</strong> Perform DNS lookups and reverse DNS
            queries
          </li>
          <li>
            <strong>Network Diagnostics:</strong> Run ping, traceroute, and
            netstat commands
          </li>
          <li>
            <strong>Network Info:</strong> View detailed information about your
            network adapters
          </li>
          <li>
            <strong>Whois Lookup:</strong> Get information about IP addresses
            and their origins
          </li>
          <li>
            <strong>MAC Address Tools:</strong> Resolve and view MAC addresses
          </li>
          <li>
            <strong>WiFi Passwords:</strong> View saved WiFi network credentials
          </li>
          <li>
            <strong>Network Configuration:</strong> Manage network adapter
            settings
          </li>
          <li>
            <strong>Dark/Light Theme:</strong> Choose your preferred visual
            theme
          </li>
        </ul>
      </div>

      <div className="card">
        <h3>Developer</h3>
        <div style={{ marginTop: "16px" }}>
          <p>
            <strong>Name:</strong> Matarr Sama
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:matarrsama@gmail.com"
              style={{ color: "var(--accent-color)", textDecoration: "none" }}
            >
              matarrsama@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Version</h3>
        <p>
          <strong>Current Version:</strong> 1.0.0
        </p>
        <div style={{ marginTop: 8 }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={checkUpdates}
          >
            Check for updates
          </button>
        </div>
        <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>
          Built with Electron, React, and TypeScript for a modern, responsive
          experience.
        </p>
      </div>

      <div className="card info-card">
        <h3>💡 Tips</h3>
        <ul style={{ color: "var(--text-secondary)" }}>
          <li>Use the navigation menu on the left to access different tools</li>
          <li>Toggle between dark and light themes in the Settings page</li>
          <li>Some network operations may require administrator privileges</li>
          <li>Hover over input fields for helpful tooltips and descriptions</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
