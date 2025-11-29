import React, { useState, useEffect } from 'react';

interface WiFiNetwork {
  ssid: string;
  password: string;
  security: string;
  lastConnected?: string;
}

const WiFiPasswords: React.FC = () => {
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'security'>('name');

  useEffect(() => {
    loadWiFiNetworks();
  }, []);

  const loadWiFiNetworks = async () => {
    try {
      setLoading(true);
      setMessage('');
      const result = await (window as any).electronAPI.getWiFiPasswords();
      
      if (result.error) {
        setMessageType('error');
        setMessage(result.error);
        setNetworks([]);
      } else {
        setMessageType('success');
        setMessage(`Found ${result.networks?.length || 0} saved WiFi networks`);
        setNetworks(result.networks || []);
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Error loading WiFi networks: ${error}`);
      setNetworks([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setMessageType('success');
    setMessage(`${label} copied to clipboard!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const filteredNetworks = networks
    .filter(network =>
      network.ssid.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.ssid.localeCompare(b.ssid);
      } else {
        return a.security.localeCompare(b.security);
      }
    });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📶 WiFi Passwords</h1>
        <p>View saved WiFi network passwords and details</p>
      </div>

      <div className="card">
        <h2>Saved Networks</h2>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="🔍 Search networks by name..."
            aria-label="Search WiFi networks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            className="input-field"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={loadWiFiNetworks}
            disabled={loading}
            aria-label="Refresh WiFi networks"
          >
            {loading ? 'Loading...' : 'Refresh Networks'}
          </button>
        </div>

        <div className="search-controls">
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'security')} disabled={loading}>
              <option value="name">Network Name (A-Z)</option>
              <option value="security">Security Type</option>
            </select>
          </div>
          {searchTerm && (
            <p className="search-info">Found {filteredNetworks.length} of {networks.length} networks</p>
          )}
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
            />
            <span>Show Passwords</span>
          </label>
        </div>
      </div>

      {message && (
        <div className={`card message-card message-${messageType}`}>
          <strong>{messageType === 'success' ? '✓' : messageType === 'error' ? '✕' : 'ℹ'}</strong>
          <p>{message}</p>
        </div>
      )}

      {filteredNetworks.length === 0 && !loading && (
        <div className="card info-card">
          <h3>ℹ️ No Networks Found</h3>
          <p>
            {networks.length === 0
              ? 'No saved WiFi networks found on this system.'
              : 'No networks match your search.'}
          </p>
        </div>
      )}

      {filteredNetworks.map((network, index) => (
        <div key={index} className="card wifi-card">
          <div className="wifi-header">
            <div className="wifi-info">
              <h3>📶 {network.ssid || '(Hidden Network)'}</h3>
              <p className="security-badge">🔒 {network.security || 'Unknown'}</p>
            </div>
            {network.lastConnected && (
              <p className="last-connected">Last connected: {network.lastConnected}</p>
            )}
          </div>

          <div className="wifi-details">
            <div className="detail-row">
              <label>Network Name (SSID):</label>
              <div className="detail-value">
                <span>{network.ssid}</span>
                <button
                  className="btn-small"
                  onClick={() => copyToClipboard(network.ssid, 'SSID')}
                  title="Copy SSID"
                >
                  📋
                </button>
              </div>
            </div>

            <div className="detail-row">
              <label>Password:</label>
              <div className="detail-value">
                <span>
                  {showPasswords ? network.password : '•'.repeat(Math.min(network.password.length, 16))}
                </span>
                {network.password && (
                  <button
                    className="btn-small"
                    onClick={() => copyToClipboard(network.password, 'Password')}
                    title="Copy Password"
                  >
                    📋
                  </button>
                )}
              </div>
            </div>

            <div className="detail-row">
              <label>Security Type:</label>
              <div className="detail-value">
                <span>{network.security || 'Unknown'}</span>
              </div>
            </div>

            {network.lastConnected && (
              <div className="detail-row">
                <label>Last Connected:</label>
                <div className="detail-value">
                  <span>{network.lastConnected}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="card warning-card">
        <h3>⚠️ Security & Privacy Notice</h3>
        <ul>
          <li>WiFi passwords are stored in plaintext on your system by Windows</li>
          <li>Only view passwords for networks you own or have permission to access</li>
          <li>Be careful sharing screenshots or screenshots containing passwords</li>
          <li>These passwords are accessible to administrative users on this computer</li>
          <li>Consider changing passwords if you've connected on untrusted networks</li>
          <li>Use strong, unique passwords for all WiFi networks</li>
        </ul>
      </div>

      <div className="card info-card">
        <h3>💡 About WiFi Passwords</h3>
        <p>
          Windows stores WiFi network credentials for previously connected networks.
          This tool retrieves those saved passwords using system commands.
        </p>
        <ul>
          <li><strong>SSID:</strong> The network name (Service Set Identifier)</li>
          <li><strong>Password:</strong> The security key/passphrase for the network</li>
          <li><strong>Security:</strong> The encryption type (WPA2, WPA3, Open, etc.)</li>
          <li><strong>Last Connected:</strong> When the device last connected to this network</li>
        </ul>
      </div>
    </div>
  );
};

export default WiFiPasswords;
