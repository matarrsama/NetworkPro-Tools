import React, { useState } from 'react';

const NetworkDiagnostics = () => {
  const [host, setHost] = useState('8.8.8.8');
  const [pingCount, setPingCount] = useState('4');
  const [pingResult, setPingResult] = useState(null);
  const [tracerouteResult, setTracerouteResult] = useState(null);
  const [netstatResult, setNetstatResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const executePing = async () => {
    try {
      setIsLoading(true);
      const res = await (window as any).electronAPI.ping(host, parseInt(pingCount));
      setPingResult(res);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeTraceroute = async () => {
    try {
      setIsLoading(true);
      const res = await (window as any).electronAPI.traceroute(host);
      setTracerouteResult(res);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNetstat = async () => {
    try {
      setIsLoading(true);
      const res = await (window as any).electronAPI.netstat();
      setNetstatResult(res);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>🔍 Network Diagnostics</h2>
      
      <div className="card">
        <h3>Ping Utility</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Host or IP address"
            aria-label="Host or IP address for ping"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Packet count"
            aria-label="Ping packet count"
            value={pingCount}
            onChange={(e) => setPingCount(e.target.value)}
            className="input-field"
            min="1"
            max="100"
          />
          <button type="button" className="btn btn-primary" onClick={executePing} disabled={isLoading} aria-label="Execute ping">
            {isLoading ? 'Pinging...' : 'Ping'}
          </button>
        </div>
        {pingResult && (
          <div className="result-card">
            <pre>{(pingResult as any).output || (pingResult as any).summary}</pre>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Traceroute Utility</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Host or IP address"
            aria-label="Host or IP address for traceroute"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="input-field"
          />
          <button type="button" className="btn btn-primary" onClick={executeTraceroute} disabled={isLoading} aria-label="Execute traceroute">
            {isLoading ? 'Tracing...' : 'Traceroute'}
          </button>
        </div>
        {tracerouteResult && (
          <div className="result-card">
            <pre>{(tracerouteResult as any).output || (tracerouteResult as any).error}</pre>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Netstat - Active Connections</h3>
        <button type="button" className="btn btn-primary" onClick={getNetstat} disabled={isLoading} aria-label="Get active connections">
          {isLoading ? 'Loading...' : 'Get Connections'}
        </button>
        {netstatResult && (
          <div className="result-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Protocol</th>
                  <th>Local Address</th>
                  <th>Remote Address</th>
                  <th>State</th>
                  <th>PID</th>
                </tr>
              </thead>
              <tbody>
                {(netstatResult as any).connections?.slice(0, 20).map((conn: any, i: number) => (
                  <tr key={i}>
                    <td>{conn.protocol}</td>
                    <td>{conn.localAddress}</td>
                    <td>{conn.remoteAddress}</td>
                    <td>{conn.state}</td>
                    <td>{conn.pid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-muted">Showing first 20 connections</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkDiagnostics;
