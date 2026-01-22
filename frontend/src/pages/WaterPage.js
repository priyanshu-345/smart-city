import React, { useState } from 'react';
import { predictWater } from '../services/api';
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

const WaterPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await predictWater();
      setPrediction(result);
      setHistory([...history, { timestamp: new Date().toLocaleString(), ...result }]);
    } catch (error) {
      alert('Error making prediction: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: history.map((h, i) => h.timestamp || `Prediction ${i + 1}`),
    datasets: [
      {
        label: 'Water Consumption (Liters)',
        data: history.map(h => h.predicted_consumption_liters),
        borderColor: 'rgb(255, 107, 107)',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        fill: true,
      }
    ]
  };

  return (
    <div className="container">
      <h1>Water Management Prediction</h1>
      <p className="page-description">Predict water demand using LSTM neural network</p>

      <div className="page-layout">
        <div className="form-section">
          <div className="card">
            <h2>Water Prediction</h2>
            <p>This model uses historical data patterns to predict future water consumption.</p>
            <button 
              onClick={handlePredict} 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', marginTop: '20px' }}
            >
              {loading ? 'Predicting...' : 'Predict Water Consumption'}
            </button>
          </div>

          {prediction && (
            <div className="card prediction-result">
              <h2>Prediction Result</h2>
              <div className="result-item">
                <span className="result-label">Predicted Consumption:</span>
                <span className="result-value">{prediction.predicted_consumption_liters} Liters</span>
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

export default WaterPage;



