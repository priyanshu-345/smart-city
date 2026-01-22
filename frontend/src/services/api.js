import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const register = async (username, password, email) => {
  const response = await api.post('/api/register', { username, password, email });
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post('/api/login', { username, password });
  return response.data;
};

// Prediction APIs
export const predictTraffic = async (data) => {
  const response = await api.post('/predict/traffic', data);
  return response.data;
};

export const predictEnergy = async (data) => {
  const response = await api.post('/predict/energy', data);
  return response.data;
};

export const predictWater = async () => {
  const response = await api.post('/predict/water', {});
  return response.data;
};

export const predictWaste = async (data) => {
  const response = await api.post('/predict/waste', data);
  return response.data;
};

export const predictAirQuality = async (data) => {
  const response = await api.post('/predict/air', data);
  return response.data;
};

// Stats APIs
export const getStats = async () => {
  const response = await api.get('/api/stats');
  return response.data;
};

export const getPredictions = async (module = null, limit = 100) => {
  const params = { limit };
  if (module) params.module = module;
  const response = await api.get('/api/predictions', { params });
  return response.data;
};

// PDF Download
export const downloadPDFReport = async () => {
  const response = await api.get('/api/generate-pdf', {
    responseType: 'blob', // Important for file download
  });
  
  // Create blob and download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `smart_city_report_${new Date().toISOString().split('T')[0]}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default api;



