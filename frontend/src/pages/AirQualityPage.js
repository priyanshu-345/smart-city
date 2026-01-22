import React, { useState } from 'react';
import { predictAirQuality } from '../services/api';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import './Page.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const AirQualityPage = () => {
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    day_of_week: new Date().getDay(),
    temperature: 25,
    wind_speed: 10,
    pm25: 50,
    pm10: 75,
    no2: 40,
    co: 1.5
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
      const result = await predictAirQuality(formData);
      setPrediction(result);
      setHistory([...history, { ...formData, ...result }]);
    } catch (error) {
      alert('Error making prediction: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const chartData = prediction ? {
    labels: ['PM2.5', 'PM10', 'NO2', 'CO', 'Temperature', 'Wind Speed'],
    datasets: [
      {
        label: 'Air Quality Metrics',
        data: [
          formData.pm25,
          formData.pm10,
          formData.no2,
          formData.co * 10, // Scale CO for visibility
          formData.temperature,
          formData.wind_speed
        ],
        backgroundColor: prediction.predicted_quality === 'Good/Moderate' 
          ? 'rgba(39, 174, 96, 0.2)' 
          : 'rgba(231, 76, 60, 0.2)',
        borderColor: prediction.predicted_quality === 'Good/Moderate' 
          ? 'rgba(39, 174, 96, 1)' 
          : 'rgba(231, 76, 60, 1)',
        borderWidth: 2
      }
    ]
  } : null;

  return (
    <div className="container">
      <h1>Air Quality Monitoring</h1>
      <p className="page-description">Predict air quality using Logistic Regression</p>

      <div className="page-layout">
        <div className="form-section">
          <div className="card">
            <h2>Input Parameters</h2>
            <form onSubmit={handleSubmit}>
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
                <label>Wind Speed (km/h)</label>
                <input
                  type="number"
                  name="wind_speed"
                  value={formData.wind_speed}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>PM2.5 (μg/m³)</label>
                <input
                  type="number"
                  name="pm25"
                  value={formData.pm25}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>PM10 (μg/m³)</label>
                <input
                  type="number"
                  name="pm10"
                  value={formData.pm10}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>NO2 (μg/m³)</label>
                <input
                  type="number"
                  name="no2"
                  value={formData.no2}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>CO (ppm)</label>
                <input
                  type="number"
                  name="co"
                  value={formData.co}
                  onChange={handleChange}
                  step="0.1"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Air Quality'}
              </button>
            </form>
          </div>

          {prediction && (
            <div className="card prediction-result">
              <h2>Prediction Result</h2>
              <div className="result-item">
                <span className="result-label">Predicted Quality:</span>
                <span className={`result-value ${prediction.predicted_quality === 'Good/Moderate' ? 'congestion-low' : 'congestion-high'}`}>
                  {prediction.predicted_quality}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="chart-section">
          <div className="card">
            <h2>Air Quality Metrics</h2>
            {chartData ? (
              <Radar data={chartData} />
            ) : (
              <p className="no-data">Make a prediction to see the air quality metrics chart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityPage;





