import React, { useState, useEffect } from 'react';

const NetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNetworkInfo();
  }, []);

  const loadNetworkInfo = async () => {
    try {
      setLoading(true);
      const info = await (window as any).electronAPI.getNetworkInfo();
      setNetworkInfo(info);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>🖥️ Network Information</h2>
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <div className="loading"></div>
          <p style={{ marginTop: 12 }}>Loading network information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>🖥️ Network Information</h2>

      {networkInfo && (
        <>
          <div className="card">
            <h3>System Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Hostname:</strong>
                <span>{(networkInfo as any).hostname}</span>
              </div>
              <div className="info-item">
                <strong>Platform:</strong>
                <span>{(networkInfo as any).platform}</span>
              </div>
              <div className="info-item">
                <strong>OS Type:</strong>
                <span>{(networkInfo as any).type}</span>
              </div>
              <div className="info-item">
                <strong>Total Interfaces:</strong>
                <span>{Object.keys((networkInfo as any).interfaces).length}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Network Interfaces</h3>
            {Object.entries((networkInfo as any).interfaces).map(([name, addrs]: any) => (
              <div key={name} className="interface-detail">
                <h4>{name}</h4>
                {addrs?.map((addr: any, idx: number) => (
                  <div key={idx} className="address-block">
                    <p><strong>Family:</strong> IPv{addr.family}</p>
                    <p><strong>Address:</strong> {addr.address}</p>
                    <p><strong>Netmask:</strong> {addr.netmask}</p>
                    <p><strong>MAC Address:</strong> <code>{addr.mac}</code></p>
                    <p><strong>Internal:</strong> {addr.internal ? 'Yes' : 'No'}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      <button className="btn btn-primary" onClick={loadNetworkInfo}>
        🔄 Refresh
      </button>
    </div>
  );
};

export default NetworkInfo;
