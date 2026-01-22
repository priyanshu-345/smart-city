import React, { useState, useEffect } from 'react';
import { getPredictions, getStats, downloadPDFReport } from '../services/api';
import SearchBar from '../components/SearchBar';
import Notification from '../components/Notification';
import ExportButton from '../components/ExportButton';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Page.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [selectedModule, setSelectedModule] = useState('all');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedModule]);

  const fetchData = async () => {
    try {
      const [statsData, predictionsData] = await Promise.all([
        getStats(),
        getPredictions(selectedModule === 'all' ? null : selectedModule)
      ]);
      setStats(statsData);
      const preds = predictionsData.predictions || [];
      setPredictions(preds);
      setFilteredPredictions(preds);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadPDFReport();
      setNotification({ message: 'PDF report downloaded successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Error downloading PDF. Please try again.', type: 'error' });
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = predictions.filter(pred => 
        pred.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(pred.result || pred.input || {}).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPredictions(filtered);
    } else {
      setFilteredPredictions(predictions);
    }
  }, [searchTerm, predictions]);

  if (loading) {
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  const moduleStatsData = {
    labels: ['Traffic', 'Energy', 'Water', 'Waste', 'Air Quality'],
    datasets: [
      {
        label: 'Total Predictions',
        data: [
          stats?.traffic?.total || 0,
          stats?.energy?.total || 0,
          stats?.water?.total || 0,
          stats?.waste?.total || 0,
          stats?.air?.total || 0
        ],
        backgroundColor: [
          'rgba(255, 107, 107, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(39, 174, 96, 0.6)',
          'rgba(231, 76, 60, 0.6)'
        ]
      }
    ]
  };

  const recentPredictions = filteredPredictions.slice(0, 10);
  const predictionsByModule = recentPredictions.reduce((acc, pred) => {
    acc[pred.module] = (acc[pred.module] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container fade-in">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1>Reports & Analytics</h1>
          <p className="page-description">View detailed reports and analytics for all modules</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleDownloadPDF} 
            disabled={downloading}
            className="btn btn-primary"
            style={{ 
              padding: '12px 24px', 
              fontSize: '16px',
              backgroundColor: downloading ? '#6c757d' : '#007bff',
              cursor: downloading ? 'not-allowed' : 'pointer',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
              marginTop: '10px',
              boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
            }}
          >
            {downloading ? '⏳ Downloading...' : '📥 Download PDF Report'}
          </button>
          <ExportButton module={selectedModule === 'all' ? null : selectedModule} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="filter-section" style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Filter by Module: </label>
          <select 
            value={selectedModule} 
            onChange={(e) => setSelectedModule(e.target.value)}
            className="form-group select"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
          >
            <option value="all">All Modules</option>
            <option value="traffic">Traffic</option>
            <option value="energy">Energy</option>
            <option value="water">Water</option>
            <option value="waste">Waste</option>
            <option value="air">Air Quality</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Search Predictions: </label>
          <SearchBar
            placeholder="Search by module or prediction..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      <div className="grid" style={{ marginBottom: '30px' }}>
        <div className="card">
          <h2>Module Statistics</h2>
          <Bar data={moduleStatsData} />
        </div>

        <div className="card">
          <h2>Recent Predictions Distribution</h2>
          <Bar 
            data={{
              labels: Object.keys(predictionsByModule),
              datasets: [{
                label: 'Count',
                data: Object.values(predictionsByModule),
                backgroundColor: 'rgba(153, 102, 255, 0.6)'
              }]
            }}
          />
        </div>
      </div>

      <div className="card">
        <h2>Recent Predictions</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Module</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Timestamp</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Prediction</th>
              </tr>
            </thead>
            <tbody>
              {recentPredictions.length > 0 ? (
                recentPredictions.map((pred, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px', textTransform: 'capitalize' }}>{pred.module || 'N/A'}</td>
                    <td style={{ padding: '10px' }}>
                      {pred.timestamp ? new Date(pred.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ padding: '10px', fontSize: '12px' }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {JSON.stringify(pred.result || pred, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>
                    No predictions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;



