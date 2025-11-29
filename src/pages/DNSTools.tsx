import React, { useState } from 'react';

const DNSTools = () => {
  const [domain, setDomain] = useState('google.com');
  const [ip, setIp] = useState('8.8.8.8');
  const [dnsResult, setDnsResult] = useState(null);
  const [reverseDNSResult, setReverseDNSResult] = useState(null);

  const resolveDNS = async () => {
    try {
      const res = await (window as any).electronAPI.resolveDNS(domain);
      setDnsResult(res);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const reverseDNS = async () => {
    try {
      const res = await (window as any).electronAPI.reverseDNS(ip);
      setReverseDNSResult(res);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="page-container">
      <h2>🌐 DNS Tools</h2>
      
      <div className="card">
        <h3>Forward DNS Resolution</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Domain name (e.g., google.com)"
            aria-label="Domain name"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="input-field"
          />
          <button type="button" className="btn btn-primary" onClick={resolveDNS} aria-label="Resolve domain">
            Resolve Domain
          </button>
        </div>
        {dnsResult && (
          <div className="result-card">
            <h4>Results for: {(dnsResult as any).domain}</h4>
            {(dnsResult as any).addresses ? (
              <ul>
                {(dnsResult as any).addresses.map((addr: any, i: number) => (
                  <li key={i}>{addr.address} (IPv{addr.family})</li>
                ))}
              </ul>
            ) : (
              <p className="error">{(dnsResult as any).error}</p>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Reverse DNS Resolution</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="IP Address (e.g., 8.8.8.8)"
            aria-label="IP address for reverse lookup"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="input-field"
          />
          <button type="button" className="btn btn-primary" onClick={reverseDNS} aria-label="Reverse DNS lookup">
            Reverse Lookup
          </button>
        </div>
        {reverseDNSResult && (
          <div className="result-card">
            <h4>Reverse DNS for: {(reverseDNSResult as any).ip}</h4>
            {(reverseDNSResult as any).hostnames ? (
              <ul>
                {(reverseDNSResult as any).hostnames.map((hostname: string, i: number) => (
                  <li key={i}>{hostname}</li>
                ))}
              </ul>
            ) : (
              <p className="error">{(reverseDNSResult as any).error}</p>
            )}
          </div>
        )}
      </div>

      <div className="card info-card">
        <h3>💡 DNS Information</h3>
        <p>DNS (Domain Name System) translates domain names to IP addresses and vice versa.</p>
        <ul>
          <li><strong>Forward DNS:</strong> Converts domain names to IP addresses</li>
          <li><strong>Reverse DNS:</strong> Converts IP addresses back to domain names</li>
          <li><strong>Use Cases:</strong> Domain verification, troubleshooting, email validation</li>
        </ul>
      </div>
    </div>
  );
};

export default DNSTools;
