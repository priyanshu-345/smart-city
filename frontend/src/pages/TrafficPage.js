import React, { useState } from 'react';
import { predictTraffic } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Page.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrafficPage = () => {
  const [formData, setFormData] = useState({
    hour: new Date().getHours(),
    day_of_week: new Date().getDay(),
    month: new Date().getMonth() + 1,
    temperature: 25,
    weather: 'Sunny'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await predictTraffic(formData);
      setPrediction(result);
      setHistory([...history, { ...formData, ...result }]);
    } catch (error) {
      alert('Error making prediction: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: history.map((_, i) => `Prediction ${i + 1}`),
    datasets: [
      {
        label: 'Vehicle Count',
        data: history.map(h => h.predicted_vehicle_count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }
    ]
  };

  return (
    <div className="container">
      <h1>Traffic Management Prediction</h1>
      <p className="page-description">Predict traffic congestion using Random Forest algorithm</p>

      <div className="page-layout">
        <div className="form-section">
          <div className="card">
            <h2>Input Parameters</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Hour (0-23)</label>
                <input
                  type="number"
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                  min="0"
                  max="23"
                  required
                />
              </div>

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
                <label>Month (1-12)</label>
                <input
                  type="number"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  required
                />
              </div>

              <div className="form-group">
                <label>Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Weather</label>
                <select
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  required
                >
                  <option value="Sunny">Sunny</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Cloudy">Cloudy</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Traffic'}
              </button>
            </form>
          </div>

          {prediction && (
            <div className="card prediction-result">
              <h2>Prediction Result</h2>
              <div className="result-item">
                <span className="result-label">Predicted Vehicle Count:</span>
                <span className="result-value">{prediction.predicted_vehicle_count}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Congestion Level:</span>
                <span className={`result-value congestion-${prediction.congestion_level?.toLowerCase()}`}>
                  {prediction.congestion_level}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="chart-section">
          <div className="card">
            <h2>Prediction History</h2>
            {history.length > 0 ? (
              <Line data={chartData} />
            ) : (
              <p className="no-data">No predictions yet. Make a prediction to see the chart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficPage;





