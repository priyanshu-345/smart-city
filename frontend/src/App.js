import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrafficPage from './pages/TrafficPage';
import EnergyPage from './pages/EnergyPage';
import WaterPage from './pages/WaterPage';
import WastePage from './pages/WastePage';
import AirQualityPage from './pages/AirQualityPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [username, setUsername] = useState(
    localStorage.getItem('username') || ''
  );

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('username', username);
  }, [isAuthenticated, username]);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    // Clear all localStorage data
    localStorage.clear();
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          {isAuthenticated && <Navbar username={username} onLogout={handleLogout} />}
          <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/traffic"
            element={
              isAuthenticated ? (
                <TrafficPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/energy"
            element={
              isAuthenticated ? (
                <EnergyPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/water"
            element={
              isAuthenticated ? (
                <WaterPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/waste"
            element={
              isAuthenticated ? (
                <WastePage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/air"
            element={
              isAuthenticated ? (
                <AirQualityPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/reports"
            element={
              isAuthenticated ? (
                <ReportsPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <SettingsPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <ProfilePage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
          />
        </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;



