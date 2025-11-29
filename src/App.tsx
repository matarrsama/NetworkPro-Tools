import React, { useState, useEffect } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import ToastProvider, { useToasts } from "./components/Toast";
import UpdateBanner from "./components/UpdateBanner";
import Dashboard from "./pages/Dashboard";
import IPCalculator from "./pages/IPCalculator";
import DNSTools from "./pages/DNSTools";
import NetworkDiagnostics from "./pages/NetworkDiagnostics";
import PortScanner from "./pages/PortScanner";
import NetworkInfo from "./pages/NetworkInfo";
import WhoisLookup from "./pages/WhoisLookup";
import MACAddressTools from "./pages/MACAddressTools";
import NetworkConfiguration from "./pages/NetworkConfiguration";
import WiFiPasswords from "./pages/WiFiPasswords";
import Settings from "./pages/Settings";
import About from "./pages/About";

type ActivePage =
  | "dashboard"
  | "ip-calculator"
  | "dns"
  | "diagnostics"
  | "port-scanner"
  | "network-info"
  | "whois"
  | "mac-address"
  | "network-config"
  | "wifi-passwords"
  | "settings"
  | "about";

function App() {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "ip-calculator":
        return <IPCalculator />;
      case "dns":
        return <DNSTools />;
      case "diagnostics":
        return <NetworkDiagnostics />;
      case "port-scanner":
        return <PortScanner />;
      case "network-info":
        return <NetworkInfo />;
      case "whois":
        return <WhoisLookup />;
      case "mac-address":
        return <MACAddressTools />;
      case "network-config":
        return <NetworkConfiguration />;
      case "wifi-passwords":
        return <WiFiPasswords />;
      case "settings":
        return (
          <Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        );
      case "about":
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ToastProvider>
      <div className="app">
        <Navigation activePage={activePage} setActivePage={setActivePage} />
        <main className="main-content">
          <div className="page-transition">{renderPage()}</div>
        </main>
        <UpdateListener />
      </div>
    </ToastProvider>
  );
}

const UpdateListener: React.FC = () => {
  const { addToast } = useToasts();
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (!api) return;

    try {
      api.onUpdateAvailable &&
        api.onUpdateAvailable(() => {
          addToast("Update available — downloading in background", "info");
          // mark as starting download
          setDownloading(true);
        });

      api.onDownloadProgress &&
        api.onDownloadProgress((progress: any) => {
          // progress.percent is often available (0-100)
          const pct =
            progress?.percent ??
            (progress?.transferred && progress?.total
              ? (progress.transferred / progress.total) * 100
              : 0);
          setProgress(pct);
          setDownloading(true);
        });

      api.onUpdateDownloaded &&
        api.onUpdateDownloaded(() => {
          setDownloaded(true);
          setDownloading(false);
          setProgress(100);
          addToast("Update downloaded — ready to install", "success");
        });
    } catch (err) {
      console.error("Update listener registration failed", err);
    }
  }, [addToast]);

  const handleInstall = () => {
    const api = (window as any).electronAPI;
    if (api && api.installUpdate) {
      api.installUpdate();
    }
  };

  const handleLater = () => {
    setDownloaded(false);
    setDownloading(false);
    setProgress(0);
    addToast("Update deferred — install later from About", "info");
  };

  if (!downloaded && !downloading) return null;
  return (
    <UpdateBanner
      message={
        downloading ? "Downloading update..." : "An update has been downloaded."
      }
      onInstall={handleInstall}
      onLater={handleLater}
      downloading={downloading}
      progress={progress}
    />
  );
};

export default App;
