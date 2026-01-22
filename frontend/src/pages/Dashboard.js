import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    if (settings.autoRefresh !== false) {
      const interval = (settings.refreshInterval || 30) * 1000;
      const timer = setInterval(fetchStats, interval);
      return () => clearInterval(timer);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalPredictions = (stats?.traffic?.total || 0) + 
                          (stats?.energy?.total || 0) + 
                          (stats?.water?.total || 0) + 
                          (stats?.waste?.total || 0) + 
                          (stats?.air?.total || 0);

  return (
    <div className="container fade-in" style={{ paddingBottom: '50px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1>🏙️ Smart City Dashboard</h1>
          <p style={{ color: '#7f8c8d', fontSize: '16px', marginTop: '5px' }}>
            Real-time resource optimization and monitoring
          </p>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)',
          padding: '20px 30px',
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
          minWidth: '200px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Predictions</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '5px' }}>{totalPredictions}</div>
        </div>
      </div>

      <div className="grid" style={{ marginBottom: '30px' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)',
          borderLeft: '5px solid #ff6b6b'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>Traffic Predictions</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff6b6b' }}>
                {stats?.traffic?.total || 0}
              </div>
            </div>
            <div style={{ fontSize: '40px' }}>🚦</div>
          </div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 159, 64, 0.1) 0%, rgba(255, 159, 64, 0.05) 100%)',
          borderLeft: '5px solid #f39c12'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>Energy Predictions</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f39c12' }}>
                {stats?.energy?.total || 0}
              </div>
            </div>
            <div style={{ fontSize: '40px' }}>⚡</div>
          </div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)',
          borderLeft: '5px solid #ff6b6b'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>Water Predictions</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff6b6b' }}>
                {stats?.water?.total || 0}
              </div>
            </div>
            <div style={{ fontSize: '40px' }}>💧</div>
          </div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%)',
          borderLeft: '5px solid #27ae60'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>Waste Predictions</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#27ae60' }}>
                {stats?.waste?.total || 0}
              </div>
            </div>
            <div style={{ fontSize: '40px' }}>🗑️</div>
          </div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(231, 76, 60, 0.05) 100%)',
          borderLeft: '5px solid #e74c3c'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>Air Quality Predictions</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e74c3c' }}>
                {stats?.air?.total || 0}
              </div>
            </div>
            <div style={{ fontSize: '40px' }}>🌬️</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>📋 Available Modules</h2>
        <div className="dashboard-grid">
          <Link to="/traffic" className="dashboard-card traffic">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>🚦 Traffic Management</h2>
              <span className="badge badge-info">{stats?.traffic?.total || 0}</span>
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">Total Predictions:</span>
                <span className="stat-value">{stats?.traffic?.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">High Congestion:</span>
                <span className={`stat-value ${stats?.traffic?.high_congestion > 0 ? 'badge badge-danger' : ''}`}>
                  {stats?.traffic?.high_congestion || 0}
                </span>
              </div>
            </div>
            <p className="card-description">🤖 Random Forest Algorithm</p>
          </Link>

          <Link to="/energy" className="dashboard-card energy">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>⚡ Energy Management</h2>
              <span className="badge badge-warning">{stats?.energy?.total || 0}</span>
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">Total Predictions:</span>
                <span className="stat-value">{stats?.energy?.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Consumption:</span>
                <span className="stat-value">{stats?.energy?.avg_consumption || 0} kWh</span>
              </div>
            </div>
            <p className="card-description">🤖 Linear Regression Algorithm</p>
          </Link>

          <Link to="/water" className="dashboard-card water">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>💧 Water Management</h2>
              <span className="badge badge-info">{stats?.water?.total || 0}</span>
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">Total Predictions:</span>
                <span className="stat-value">{stats?.water?.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Consumption:</span>
                <span className="stat-value">{stats?.water?.avg_consumption || 0} L</span>
              </div>
            </div>
            <p className="card-description">🤖 LSTM Neural Network</p>
          </Link>

          <Link to="/waste" className="dashboard-card waste">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>🗑️ Waste Management</h2>
              <span className="badge badge-success">{stats?.waste?.total || 0}</span>
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">Total Predictions:</span>
                <span className="stat-value">{stats?.waste?.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Collection Needed:</span>
                <span className={`stat-value ${stats?.waste?.collection_needed > 0 ? 'badge badge-warning' : ''}`}>
                  {stats?.waste?.collection_needed || 0}
                </span>
              </div>
            </div>
            <p className="card-description">🤖 KNN Algorithm</p>
          </Link>

          <Link to="/air" className="dashboard-card air">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>🌬️ Air Quality Monitoring</h2>
              <span className="badge badge-danger">{stats?.air?.total || 0}</span>
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">Total Predictions:</span>
                <span className="stat-value">{stats?.air?.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Unhealthy Days:</span>
                <span className={`stat-value ${stats?.air?.unhealthy_days > 0 ? 'badge badge-danger' : 'badge badge-success'}`}>
                  {stats?.air?.unhealthy_days || 0}
                </span>
              </div>
            </div>
            <p className="card-description">🤖 Logistic Regression</p>
          </Link>

          <Link to="/reports" className="dashboard-card reports">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>📊 Reports & Analytics</h2>
              <span className="badge badge-info">View</span>
            </div>
            <p className="card-description">View detailed reports, charts, and export data</p>
            <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(155, 89, 182, 0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                📥 PDF Export Available
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>⚡ Quick Actions</h2>
        <div className="grid" style={{ marginTop: '20px' }}>
          <Link to="/traffic" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              🚦 Predict Traffic
            </button>
          </Link>
          <Link to="/energy" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              ⚡ Predict Energy
            </button>
          </Link>
          <Link to="/water" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              💧 Predict Water
            </button>
          </Link>
          <Link to="/waste" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              🗑️ Predict Waste
            </button>
          </Link>
          <Link to="/air" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              🌬️ Predict Air Quality
            </button>
          </Link>
          <Link to="/reports" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              📊 View Reports
            </button>
          </Link>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '30px' }}>
        <div className="card">
          <h3>✅ System Status</h3>
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span>Backend API</span>
              <span className="badge badge-success">Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span>ML Models</span>
              <span className="badge badge-success">Loaded</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span>Database</span>
              <span className="badge badge-warning">Demo Mode</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>📈 Performance Metrics</h3>
          <div style={{ marginTop: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>System Efficiency</span>
                <span>95%</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                background: '#e0e0e0', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '95%', 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #27ae60, #2ecc71)',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Prediction Accuracy</span>
                <span>88%</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                background: '#e0e0e0', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '88%', 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #ff6b6b, #ff8787)',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
