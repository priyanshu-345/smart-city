import React, { useState, useEffect } from 'react';
import { getStats, getPredictions } from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Page.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    username: localStorage.getItem('username') || 'User',
    email: localStorage.getItem('email') || 'user@example.com',
    joinDate: new Date().toLocaleDateString(),
    totalPredictions: 0
  });
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [statsData, predictionsData] = await Promise.all([
        getStats(),
        getPredictions(null, 50)
      ]);
      
      setStats(statsData);
      setRecentActivity(predictionsData.predictions || []);
      
      const total = (statsData?.traffic?.total || 0) + 
                   (statsData?.energy?.total || 0) + 
                   (statsData?.water?.total || 0) + 
                   (statsData?.waste?.total || 0) + 
                   (statsData?.air?.total || 0);
      
      setUserInfo(prev => ({ ...prev, totalPredictions: total }));
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const activityChartData = {
    labels: ['Traffic', 'Energy', 'Water', 'Waste', 'Air Quality'],
    datasets: [{
      label: 'Your Predictions',
      data: [
        stats?.traffic?.total || 0,
        stats?.energy?.total || 0,
        stats?.water?.total || 0,
        stats?.waste?.total || 0,
        stats?.air?.total || 0
      ],
      backgroundColor: [
        'rgba(255, 107, 107, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(39, 174, 96, 0.8)',
        'rgba(231, 76, 60, 0.8)'
      ]
    }]
  };

  const performanceData = {
    labels: ['Last Week', 'This Week'],
    datasets: [{
      label: 'Predictions Made',
      data: [Math.floor(userInfo.totalPredictions * 0.4), Math.floor(userInfo.totalPredictions * 0.6)],
      backgroundColor: ['rgba(255, 107, 107, 0.6)', 'rgba(255, 135, 135, 0.6)'],
      borderColor: ['rgba(255, 107, 107, 1)', 'rgba(255, 135, 135, 1)'],
      borderWidth: 2
    }]
  };

  return (
    <div className="container fade-in" style={{ paddingBottom: '50px' }}>
      {/* Profile Header */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)',
        color: 'white',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: 'bold',
            border: '4px solid rgba(255, 255, 255, 0.3)'
          }}>
            {userInfo.username.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: 'white', marginBottom: '10px' }}>👤 {userInfo.username}</h1>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '5px' }}>
              📧 {userInfo.email}
            </p>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>
              🗓️ Member since: {userInfo.joinDate}
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{userInfo.totalPredictions}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Predictions</div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginBottom: '30px' }}>
        <div className="card">
          <h3>🚦 Traffic Predictions</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b6b', marginTop: '10px' }}>
            {stats?.traffic?.total || 0}
          </div>
          <div style={{ marginTop: '10px', color: '#7f8c8d' }}>
            High Congestion: <strong>{stats?.traffic?.high_congestion || 0}</strong>
          </div>
        </div>

        <div className="card">
          <h3>⚡ Energy Predictions</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12', marginTop: '10px' }}>
            {stats?.energy?.total || 0}
          </div>
          <div style={{ marginTop: '10px', color: '#7f8c8d' }}>
            Avg: <strong>{stats?.energy?.avg_consumption || 0} kWh</strong>
          </div>
        </div>

        <div className="card">
          <h3>💧 Water Predictions</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b6b', marginTop: '10px' }}>
            {stats?.water?.total || 0}
          </div>
          <div style={{ marginTop: '10px', color: '#7f8c8d' }}>
            Avg: <strong>{stats?.water?.avg_consumption || 0} L</strong>
          </div>
        </div>

        <div className="card">
          <h3>🗑️ Waste Predictions</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60', marginTop: '10px' }}>
            {stats?.waste?.total || 0}
          </div>
          <div style={{ marginTop: '10px', color: '#7f8c8d' }}>
            Collections: <strong>{stats?.waste?.collection_needed || 0}</strong>
          </div>
        </div>

        <div className="card">
          <h3>🌬️ Air Quality Predictions</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c', marginTop: '10px' }}>
            {stats?.air?.total || 0}
          </div>
          <div style={{ marginTop: '10px', color: '#7f8c8d' }}>
            Unhealthy: <strong>{stats?.air?.unhealthy_days || 0}</strong>
          </div>
        </div>

        <div className="card">
          <h3>📊 Overall Performance</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9b59b6', marginTop: '10px' }}>
            {Math.round((userInfo.totalPredictions / 100) * 100)}%
          </div>
          <div style={{ marginTop: '10px', color: '#7f8c8d' }}>
            System Usage
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginBottom: '30px' }}>
        <div className="card">
          <h2>📈 Activity Distribution</h2>
          <Doughnut 
            data={activityChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>

        <div className="card">
          <h2>📊 Weekly Performance</h2>
          <Bar 
            data={performanceData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      <div className="card">
        <h2>🕐 Recent Activity</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '20px' }}>
          {recentActivity.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 10 }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Module</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Timestamp</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Prediction</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, idx) => (
                  <tr key={idx} style={{ 
                    borderBottom: '1px solid #eee',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                        {activity.module}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#7f8c8d' }}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>
                      {JSON.stringify(activity.prediction).substring(0, 50)}...
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-success">✓ Success</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
              No activity yet. Start making predictions!
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2>⚙️ Account Actions</h2>
        <div className="grid" style={{ marginTop: '20px' }}>
          <button className="btn btn-primary" style={{ width: '100%' }}>
            ✏️ Edit Profile
          </button>
          <button className="btn btn-secondary" style={{ width: '100%' }}>
            🔑 Change Password
          </button>
          <button className="btn btn-secondary" style={{ width: '100%' }}>
            📧 Email Preferences
          </button>
          <button className="btn btn-secondary" style={{ width: '100%' }}>
            📊 Export My Data
          </button>
          <button className="btn btn-secondary" style={{ width: '100%' }}>
            🔔 Notification Settings
          </button>
          <button className="btn btn-secondary" style={{ width: '100%' }}>
            🎨 Theme Settings
          </button>
        </div>
      </div>

      <div className="card">
        <h2>ℹ️ System Information</h2>
        <div className="grid" style={{ marginTop: '20px' }}>
          <div>
            <strong>System Version:</strong> 1.0.0
          </div>
          <div>
            <strong>Last Login:</strong> {new Date().toLocaleString()}
          </div>
          <div>
            <strong>Account Status:</strong> <span className="badge badge-success">Active</span>
          </div>
          <div>
            <strong>Role:</strong> Administrator
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

