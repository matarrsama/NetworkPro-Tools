import React, { useState, useEffect } from 'react';

const MACAddressTools = () => {
  const [ipInput, setIpInput] = useState('192.168.1.1');
  const [macResult, setMacResult] = useState(null);
  const [allMacs, setAllMacs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAllMacs();
  }, []);

  const loadAllMacs = async () => {
    try {
      const res = await (window as any).electronAPI.getMACAddress();
      setAllMacs(res);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resolveMac = async () => {
    try {
      setIsLoading(true);
      const res = await (window as any).electronAPI.resolveMACAddress(ipInput);
      setMacResult(res);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>🏷️ MAC Address Tools</h2>

      <div className="card">
        <h3>Local Network Adapters</h3>
        {allMacs && (
          <div className="mac-list">
            {Object.entries(allMacs).map(([name, mac]: any) => (
              <div key={name} className="mac-item">
                <strong>{name}</strong>
                <code>{mac || 'N/A'}</code>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Resolve MAC Address from IP</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="IP Address (e.g., 192.168.1.1)"
            aria-label="IP address to resolve MAC"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            className="input-field"
          />
          <button type="button" className="btn btn-primary" onClick={resolveMac} disabled={isLoading} aria-label="Resolve MAC address">
            {isLoading ? 'Resolving...' : 'Resolve MAC'}
          </button>
        </div>

        {macResult && (
          <div className="result-card">
            <h4>MAC Address for {(macResult as any).ip}</h4>
            {(macResult as any).error ? (
              <p className="error">{(macResult as any).error}</p>
            ) : (
              <div className="mac-display">
                <code>{(macResult as any).mac}</code>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card info-card">
        <h3>💡 MAC Address Information</h3>
        <p>MAC (Media Access Control) address is a unique identifier assigned to network interfaces.</p>
        <ul>
          <li><strong>Format:</strong> 48-bit address (6 octets, e.g., 00:1A:2B:3C:4D:5E)</li>
          <li><strong>Scope:</strong> Works on Local Area Network (LAN)</li>
          <li><strong>ARP Protocol:</strong> Used to map IP addresses to MAC addresses</li>
          <li><strong>Use Cases:</strong> Device identification, MAC filtering, Wake-on-LAN</li>
        </ul>
      </div>
    </div>
  );
};

export default MACAddressTools;
