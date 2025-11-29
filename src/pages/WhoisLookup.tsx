import React, { useState } from 'react';

const WhoisLookup = () => {
  const [ip, setIp] = useState('8.8.8.8');
  const [whoisResult, setWhoisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performWhois = async () => {
    try {
      setIsLoading(true);
      const res = await (window as any).electronAPI.whois(ip);
      setWhoisResult(res);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performWhois();
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔎 Whois Lookup</h1>
        <p>Get information about IP addresses</p>
      </div>

      <div className="card">
        <h2>IP Whois Query</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="IP Address (e.g., 8.8.8.8)"
            aria-label="IP address for whois lookup"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-field"
            disabled={isLoading}
          />
          <button type="button" className="btn btn-primary" onClick={performWhois} disabled={isLoading} aria-label="Lookup whois">
            {isLoading ? 'Looking up...' : 'Lookup Whois'}
          </button>
        </div>
      </div>

      {whoisResult && (
        <div className="card result-card">
          <h2>Whois Information for {whoisResult.ip}</h2>
          {whoisResult.error ? (
            <div className="error-message">
              <p>❌ {whoisResult.error}</p>
            </div>
          ) : whoisResult.data && typeof whoisResult.data === 'object' ? (
            <div className="whois-details">
              <div className="info-grid">
                {whoisResult.data.ip && (
                  <div className="info-item">
                    <strong>IP Address:</strong>
                    <span>{whoisResult.data.ip}</span>
                  </div>
                )}
                {whoisResult.data.country && (
                  <div className="info-item">
                    <strong>Country:</strong>
                    <span>{whoisResult.data.country}</span>
                  </div>
                )}
                {whoisResult.data.city && (
                  <div className="info-item">
                    <strong>City:</strong>
                    <span>{whoisResult.data.city}</span>
                  </div>
                )}
                {whoisResult.data.isp && (
                  <div className="info-item">
                    <strong>ISP:</strong>
                    <span>{whoisResult.data.isp}</span>
                  </div>
                )}
                {whoisResult.data.organization && (
                  <div className="info-item">
                    <strong>Organization:</strong>
                    <span>{whoisResult.data.organization}</span>
                  </div>
                )}
                {whoisResult.data.asn && (
                  <div className="info-item">
                    <strong>ASN:</strong>
                    <span>{whoisResult.data.asn}</span>
                  </div>
                )}
                {whoisResult.data.reverse && (
                  <div className="info-item">
                    <strong>Reverse DNS:</strong>
                    <span>{whoisResult.data.reverse}</span>
                  </div>
                )}
                {whoisResult.data.source && (
                  <div className="info-item">
                    <strong>Source:</strong>
                    <span>{whoisResult.data.source}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <pre className="whois-output">{JSON.stringify(whoisResult.data, null, 2)}</pre>
          )}
        </div>
      )}

      <div className="card info-card">
        <h3>💡 About Whois Lookup</h3>
        <p>Whois is used to retrieve information about IP addresses and their ownership.</p>
        <ul>
          <li><strong>IP Owner:</strong> Find who owns or manages an IP address</li>
          <li><strong>Location:</strong> Geographic location of the IP</li>
          <li><strong>ISP Information:</strong> Internet Service Provider details</li>
          <li><strong>Organization:</strong> The organization assigned to the IP</li>
          <li><strong>Reverse DNS:</strong> Hostname associated with the IP</li>
        </ul>
        <p><strong>Note:</strong> This tool uses IP geolocation services. Results may not be 100% accurate.</p>
      </div>
    </div>
  );
};

export default WhoisLookup;
