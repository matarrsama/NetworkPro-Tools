import React, { useState, useEffect } from 'react';

interface ElectronAPI {
  getNetworkInfo: () => Promise<any>;
  getOpenPorts: () => Promise<any>;
  ping: (host: string, count: number) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

const Dashboard: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const info = await window.electronAPI.getNetworkInfo();
      const ports = await window.electronAPI.getOpenPorts();
      
      setNetworkInfo(info);
      setSystemStatus({
        interfaces: Object.keys(info.interfaces || {}).length,
        openPorts: ports.openPorts?.length || 0,
        hostname: info.hostname,
        platform: info.platform,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>📊 Dashboard</h2>
        <div className="card" style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
          <div className="loading"></div>
          <p style={{ marginTop: '15px', marginBottom: 0 }}>Loading network information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>📊 Dashboard</h2>
      
      <div className="dashboard-grid">
        {systemStatus && (
          <>
            <div className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
              <h3>System Information</h3>
              <ul>
                <li><strong>Hostname:</strong> {systemStatus.hostname}</li>
                <li><strong>Platform:</strong> {systemStatus.platform}</li>
                <li><strong>Network Interfaces:</strong> {systemStatus.interfaces}</li>
                <li><strong>Open Ports:</strong> {systemStatus.openPorts}</li>
              </ul>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--success-color)' }}>
              <h3>Network Interfaces</h3>
              <div className="interfaces-list">
                {networkInfo?.interfaces && Object.entries(networkInfo.interfaces).map(([name, addrs]: any) => (
                  <div key={name} className="interface-item">
                    <strong>{name}:</strong>
                    {addrs?.[0] && (
                      <p>
                        {addrs[0].address}<br />
                        <small>{addrs[0].mac}</small>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--warning-color)' }}>
              <h3>Quick Stats</h3>
              <ul>
                <li>Total Network Adapters: <strong style={{ color: 'var(--accent-color)' }}>{systemStatus.interfaces}</strong></li>
                <li>Active Open Ports: <strong style={{ color: 'var(--success-color)' }}>{systemStatus.openPorts}</strong></li>
                <li>Status: <span className="status-ok">●</span> <strong style={{ color: 'var(--success-color)' }}>Online</strong></li>
              </ul>
            </div>
          </>
        )}
      </div>

      <button className="btn btn-primary" onClick={loadDashboardData} style={{ marginTop: '20px' }}>
        🔄 Refresh Network Info
      </button>
    </div>
  );
};

export default Dashboard;
