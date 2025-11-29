import React, { useState } from 'react';

const IPCalculator = () => {
  const [ipInput, setIpInput] = useState('192.168.1.0');
  const [cidrInput, setCidrInput] = useState('24');
  const [maskInput, setMaskInput] = useState('255.255.255.0');
  const [result, setResult] = useState(null);

  const calculateIPRange = async () => {
    try {
      const res = await (window as any).electronAPI.calculateIPRange(ipInput, parseInt(cidrInput));
      setResult(res);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateSubnet = async () => {
    try {
      const res = await (window as any).electronAPI.calculateSubnet(ipInput, maskInput);
      setResult(res);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="page-container">
      <h2>🔢 IP Calculator & Subnet Tools</h2>
      
      <div className="card">
        <h3>📐 CIDR Notation Calculator</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Calculate network information from CIDR notation</p>
        <div className="form-group">
          <input
            type="text"
            placeholder="IP Address (e.g., 192.168.1.0)"
            aria-label="IP address for CIDR calculation"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="CIDR Prefix (e.g., 24)"
            aria-label="CIDR prefix"
            value={cidrInput}
            onChange={(e) => setCidrInput(e.target.value)}
            className="input-field"
            min="0"
            max="32"
          />
          <button className="btn btn-primary" onClick={calculateIPRange}>
            ✓
            Calculate CIDR
          </button>
        </div>
      </div>

      <div className="card">
        <h3>🎯 Subnet Mask Calculator</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Calculate network details using subnet masks</p>
        <div className="form-group">
          <input
            type="text"
            placeholder="IP Address"
            aria-label="IP address for subnet calculation"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Subnet Mask (e.g., 255.255.255.0)"
            aria-label="Subnet mask for calculation"
            value={maskInput}
            onChange={(e) => setMaskInput(e.target.value)}
            className="input-field"
          />
          <button className="btn btn-primary" onClick={calculateSubnet}>
            ✓
            Calculate Subnet
          </button>
        </div>
      </div>

      {result && (
        <div className="card result-card">
          <h3>✓ Calculation Results</h3>
          <div className="result-grid">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="result-item">
                <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IPCalculator;
