import React, { useState, useEffect } from 'react';

interface NetworkAdapter {
  name: string;
  description: string;
  ipv4?: string;
  subnet?: string;
  gateway?: string;
  dns1?: string;
  dns2?: string;
  dhcpEnabled: boolean;
}

const NetworkConfiguration: React.FC = () => {
  const [adapters, setAdapters] = useState<NetworkAdapter[]>([]);
  const [selectedAdapter, setSelectedAdapter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [formData, setFormData] = useState({
    useDHCP: true,
    ipAddress: '',
    subnetMask: '',
    gateway: '',
    dns1: '',
    dns2: '',
  });

  useEffect(() => {
    loadNetworkAdapters();
  }, []);

  const loadNetworkAdapters = async () => {
    try {
      setLoading(true);
      const result = await (window as any).electronAPI.getNetworkAdapters();
      setAdapters(result);
      if (result.length > 0) {
        setSelectedAdapter(result[0].name);
        updateFormData(result[0]);
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Error loading adapters: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (adapter: NetworkAdapter) => {
    setFormData({
      useDHCP: adapter.dhcpEnabled,
      ipAddress: adapter.ipv4 || '',
      subnetMask: adapter.subnet || '',
      gateway: adapter.gateway || '',
      dns1: adapter.dns1 || '',
      dns2: adapter.dns2 || '',
    });
  };

  const handleAdapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedAdapter(name);
    const adapter = adapters.find(a => a.name === name);
    if (adapter) {
      updateFormData(adapter);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateIPAddress = (ip: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    const parts = ip.split('.');
    return parts.every(part => parseInt(part) <= 255);
  };

  const validateSubnetMask = (mask: string): boolean => {
    return validateIPAddress(mask);
  };

  const applyConfiguration = async () => {
    if (!selectedAdapter) {
      setMessageType('error');
      setMessage('Please select a network adapter');
      return;
    }

    if (!formData.useDHCP) {
      if (!formData.ipAddress || !validateIPAddress(formData.ipAddress)) {
        setMessageType('error');
        setMessage('Invalid IP address format');
        return;
      }
      if (!formData.subnetMask || !validateSubnetMask(formData.subnetMask)) {
        setMessageType('error');
        setMessage('Invalid subnet mask format');
        return;
      }
      if (formData.gateway && !validateIPAddress(formData.gateway)) {
        setMessageType('error');
        setMessage('Invalid gateway IP format');
        return;
      }
      if (formData.dns1 && !validateIPAddress(formData.dns1)) {
        setMessageType('error');
        setMessage('Invalid DNS 1 IP format');
        return;
      }
      if (formData.dns2 && !validateIPAddress(formData.dns2)) {
        setMessageType('error');
        setMessage('Invalid DNS 2 IP format');
        return;
      }
    }

    try {
      setLoading(true);
      setMessage('Applying network configuration...');
      setMessageType('info');

      const result = await (window as any).electronAPI.configureNetworkAdapter({
        adapterName: selectedAdapter,
        useDHCP: formData.useDHCP,
        ipAddress: formData.ipAddress,
        subnetMask: formData.subnetMask,
        gateway: formData.gateway,
        dns1: formData.dns1,
        dns2: formData.dns2,
      });

      setMessageType('success');
      setMessage(result);
      
      // Reload adapters after configuration
      setTimeout(() => loadNetworkAdapters(), 2000);
    } catch (error) {
      setMessageType('error');
      setMessage(`Configuration failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAdapter = () => {
    return adapters.find(a => a.name === selectedAdapter);
  };

  const current = getCurrentAdapter();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔧 Network Configuration</h1>
        <p>Configure network adapter settings</p>
      </div>

      <div className="config-content">
        <div className="card">
          <h2>Select Network Adapter</h2>
          <select aria-label="Select network adapter" value={selectedAdapter} onChange={handleAdapterChange} disabled={loading}>
            {adapters.map(adapter => (
              <option key={adapter.name} value={adapter.name}>
                {adapter.name} - {adapter.description}
              </option>
            ))}
          </select>

          {current && (
            <div className="adapter-info">
              <h3>Current Configuration</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>DHCP Enabled:</strong>
                  <span>{current.dhcpEnabled ? 'Yes' : 'No'}</span>
                </div>
                {current.ipv4 && (
                  <div className="info-item">
                    <strong>Current IP:</strong>
                    <span>{current.ipv4}</span>
                  </div>
                )}
                {current.subnet && (
                  <div className="info-item">
                    <strong>Subnet Mask:</strong>
                    <span>{current.subnet}</span>
                  </div>
                )}
                {current.gateway && (
                  <div className="info-item">
                    <strong>Gateway:</strong>
                    <span>{current.gateway}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2>New Configuration</h2>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="useDHCP"
                checked={formData.useDHCP}
                onChange={handleInputChange}
                disabled={loading}
                aria-label="Use DHCP"
              />
              <span>Use DHCP (Automatic IP)</span>
            </label>
          </div>

          {!formData.useDHCP && (
            <div className="static-config">
              <div className="form-group">
                <label>IP Address *</label>
                <input
                  type="text"
                  name="ipAddress"
                  aria-label="Static IP address"
                  value={formData.ipAddress}
                  onChange={handleInputChange}
                  placeholder="192.168.1.100"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Subnet Mask *</label>
                <input
                  type="text"
                  name="subnetMask"
                  aria-label="Subnet mask"
                  value={formData.subnetMask}
                  onChange={handleInputChange}
                  placeholder="255.255.255.0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Default Gateway</label>
                <input
                  type="text"
                  name="gateway"
                  aria-label="Default gateway"
                  value={formData.gateway}
                  onChange={handleInputChange}
                  placeholder="192.168.1.1"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>DNS Server 1</label>
                <input
                  type="text"
                  name="dns1"
                  aria-label="Primary DNS server"
                  value={formData.dns1}
                  onChange={handleInputChange}
                  placeholder="8.8.8.8"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>DNS Server 2</label>
                <input
                  type="text"
                  name="dns2"
                  aria-label="Secondary DNS server"
                  value={formData.dns2}
                  onChange={handleInputChange}
                  placeholder="8.8.4.4"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={applyConfiguration}
              disabled={loading}
            >
              {loading ? 'Applying...' : 'Apply Configuration'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={loadNetworkAdapters}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <div className={`card message-card message-${messageType}`}>
            <strong>{messageType === 'success' ? '✓' : messageType === 'error' ? '✕' : 'ℹ'}</strong>
            <p>{message}</p>
          </div>
        )}

        <div className="card warning-card">
          <h3>⚠️ Important Notes</h3>
          <ul>
            <li>Administrative privileges required for network configuration changes</li>
            <li>Incorrect settings may disconnect you from the network</li>
            <li>Ensure you have valid gateway and DNS information</li>
            <li>Changes take effect immediately</li>
            <li>For DHCP, leave IP address fields empty</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetworkConfiguration;
