import React from 'react';

interface NavigationProps {
  activePage: string;
  setActivePage: (page: any) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'ip-calculator', label: 'IP Calculator', icon: '🔢' },
    { id: 'dns', label: 'DNS Tools', icon: '🌐' },
    { id: 'diagnostics', label: 'Diagnostics', icon: '🔍' },
    { id: 'port-scanner', label: 'Port Scanner', icon: '📡' },
    { id: 'network-info', label: 'Network Info', icon: '🖥️' },
    { id: 'whois', label: 'Whois Lookup', icon: '🔎' },
    { id: 'mac-address', label: 'MAC Address', icon: '🏷️' },
    { id: 'network-config', label: 'Network Config', icon: '⚙️' },
    { id: 'wifi-passwords', label: 'WiFi Passwords', icon: '📶' },
    { id: 'settings', label: 'Settings', icon: '🛠️' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1>NetworkPro Tools</h1>
      </div>
      <ul className="nav-menu">
        {menuItems.map(item => (
          <li key={item.id}>
            <button
              type="button"
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={item.label}
              aria-pressed={activePage === item.id}
              aria-label={item.label}
              style={{ width: '100%' }}
            >
              <span className="nav-icon" aria-hidden>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'flex-end', 
        padding: '15px 0', 
        borderTop: '1px solid var(--border-color)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        justifyContent: 'center'
      }}>
        v1.0.0
      </div>
    </nav>
  );
};

export default Navigation;
