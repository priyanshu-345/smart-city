import React, { useState } from 'react';
import { predictEnergy } from '../services/api';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EnergyPage = () => {
  const [formData, setFormData] = useState({
    hour: new Date().getHours(),
    month: new Date().getMonth() + 1,
    temperature: 25,
    population_density: 5000
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await predictEnergy(formData);
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
        label: 'Energy Consumption (kWh)',
        data: history.map(h => h.predicted_consumption_kwh),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
      }
    ]
  };

  return (
    <div className="container">
      <h1>Energy Management Prediction</h1>
      <p className="page-description">Forecast energy consumption using Linear Regression</p>

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
                <label>Population Density</label>
                <input
                  type="number"
                  name="population_density"
                  value={formData.population_density}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Energy Consumption'}
              </button>
            </form>
          </div>

          {prediction && (
            <div className="card prediction-result">
              <h2>Prediction Result</h2>
              <div className="result-item">
                <span className="result-label">Predicted Consumption:</span>
                <span className="result-value">{prediction.predicted_consumption_kwh} kWh</span>
              </div>
            </div>
          )}
        </div>

        <div className="chart-section">
          <div className="card">
            <h2>Prediction History</h2>
            {history.length > 0 ? (
              <Bar data={chartData} />
            ) : (
              <p className="no-data">No predictions yet. Make a prediction to see the chart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyPage;





