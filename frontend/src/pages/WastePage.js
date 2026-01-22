import React, { useState } from 'react';
import { predictWaste } from '../services/api';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './Page.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const WastePage = () => {
  const [formData, setFormData] = useState({
    day_of_week: new Date().getDay(),
    location: 'Downtown',
    waste_type: 'General'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await predictWaste(formData);
      setPrediction(result);
      setHistory([...history, { ...formData, ...result }]);
    } catch (error) {
      alert('Error making prediction: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Fill Level', 'Remaining Capacity'],
    datasets: [
      {
        data: prediction ? [
          prediction.predicted_fill_level_percent,
          100 - prediction.predicted_fill_level_percent
        ] : [0, 100],
        backgroundColor: [
          prediction && prediction.predicted_fill_level_percent > 80 ? '#e74c3c' : 
          prediction && prediction.predicted_fill_level_percent > 50 ? '#f39c12' : '#27ae60',
          '#ecf0f1'
        ],
      }
    ]
  };

  return (
    <div className="container">
      <h1>Waste Management Prediction</h1>
      <p className="page-description">Optimize waste collection using KNN algorithm</p>

      <div className="page-layout">
        <div className="form-section">
          <div className="card">
            <h2>Input Parameters</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Day of Week (0=Monday, 6=Sunday)</label>
                <input
                  type="number"
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleChange}
                  min="0"
                  max="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="Downtown">Downtown</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div className="form-group">
                <label>Waste Type</label>
                <select
                  name="waste_type"
                  value={formData.waste_type}
                  onChange={handleChange}
                  required
                >
                  <option value="General">General</option>
                  <option value="Recyclable">Recyclable</option>
                  <option value="Organic">Organic</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Waste Fill Level'}
              </button>
            </form>
          </div>

          {prediction && (
            <div className="card prediction-result">
              <h2>Prediction Result</h2>
              <div className="result-item">
                <span className="result-label">Predicted Fill Level:</span>
                <span className="result-value">{prediction.predicted_fill_level_percent}%</span>
              </div>
              <div className="result-item">
                <span className="result-label">Collection Needed:</span>
                <span className={`result-value ${prediction.collection_needed === 'Yes' ? 'congestion-high' : 'congestion-low'}`}>
                  {prediction.collection_needed}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="chart-section">
          <div className="card">
            <h2>Bin Fill Level</h2>
            {prediction ? (
              <div>
                <Doughnut data={chartData} />
                <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>
                  {prediction.predicted_fill_level_percent}% Full
                </p>
              </div>
            ) : (
              <p className="no-data">Make a prediction to see the fill level chart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WastePage;





