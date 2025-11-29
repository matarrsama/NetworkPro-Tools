import React, { useState } from 'react';

const PortScanner = () => {
  const [host, setHost] = useState('127.0.0.1');
  const [startPort, setStartPort] = useState('1');
  const [endPort, setEndPort] = useState('1000');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    try {
      setIsScanning(true);
      setScanResult(null);
      const res = await (window as any).electronAPI.scanPorts(
        host,
        parseInt(startPort),
        parseInt(endPort)
      );
      setScanResult(res);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const commonPorts = {
    'HTTP': [80],
    'HTTPS': [443],
    'SSH': [22],
    'FTP': [21],
    'Telnet': [23],
    'SMTP': [25],
    'DNS': [53],
    'DHCP': [67, 68],
    'POP3': [110],
    'IMAP': [143],
    'LDAP': [389],
    'HTTPS Alt': [8443],
    'MySQL': [3306],
    'MSSQL': [1433],
    'RDP': [3389],
    'PostgreSQL': [5432],
  };

  const quickScan = (ports: number[]) => {
    setStartPort(Math.min(...ports).toString());
    setEndPort(Math.max(...ports).toString());
  };

  return (
    <div className="page-container">
      <h2>📡 Port Scanner</h2>
      
      <div className="card">
        <h3>Port Range Scan</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Host or IP address (e.g., 127.0.0.1)"
            aria-label="Host or IP address for port scan"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Start Port"
            aria-label="Start port"
            value={startPort}
            onChange={(e) => setStartPort(e.target.value)}
            className="input-field"
            min="1"
            max="65535"
          />
          <input
            type="number"
            placeholder="End Port"
            aria-label="End port"
            value={endPort}
            onChange={(e) => setEndPort(e.target.value)}
            className="input-field"
            min="1"
            max="65535"
          />
          <button type="button" className="btn btn-primary" onClick={startScan} disabled={isScanning} aria-label="Start port scan">
            {isScanning ? 'Scanning...' : 'Scan Ports'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Quick Port Scans</h3>
        <div className="quick-buttons">
          {Object.entries(commonPorts).map(([name, ports]) => (
            <button
              key={name}
              className="btn btn-secondary btn-block"
              onClick={() => quickScan(ports)}
              title={`Ports: ${ports.join(', ')}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {scanResult && (
        <div className="card result-card">
          <h3>📊 Scan Results</h3>
          <p><strong>Host:</strong> {(scanResult as any).host}</p>
          <p><strong>Port Range:</strong> {(scanResult as any).startPort} - {(scanResult as any).endPort}</p>
          
          {(scanResult as any).openPorts && (scanResult as any).openPorts.length > 0 ? (
            <div>
              <h4>✓ Open Ports ({(scanResult as any).openPorts.length})</h4>
              <div className="ports-grid">
                {(scanResult as any).openPorts.map((port: number) => (
                  <div key={port} className="port-item">
                    <strong>:{port}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted">No open ports found</p>
          )}
        </div>
      )}

      <div className="card info-card">
        <h3>💡 Port Scanning Information</h3>
        <ul>
          <li>Port range: 1-65535</li>
          <li>Scan timeout: 2 seconds per port</li>
          <li>Only responds to open ports</li>
          <li>Ensure you have permission to scan the target host</li>
        </ul>
      </div>
    </div>
  );
};

export default PortScanner;
