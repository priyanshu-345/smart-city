import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Page.css';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    pushNotifications: false,
    autoRefresh: true,
    refreshInterval: 30,
    language: 'en',
    chartAnimation: true,
    compactMode: false,
    soundEffects: false
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      if (parsed.theme) {
        setTheme(parsed.theme);
      }
    }
  }, [setTheme]);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    if (key === 'theme') {
      setTheme(value);
    }
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    if (settings.notifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Settings Saved', {
        body: 'Your preferences have been saved successfully!',
        icon: '/favicon.ico'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        handleChange('pushNotifications', true);
      }
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaults = {
        theme: 'light',
        notifications: true,
        emailNotifications: true,
        pushNotifications: false,
        autoRefresh: true,
        refreshInterval: 30,
        language: 'en',
        chartAnimation: true,
        compactMode: false,
        soundEffects: false
      };
      setSettings(defaults);
      setTheme('light');
      localStorage.setItem('appSettings', JSON.stringify(defaults));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="container fade-in" style={{ paddingBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1>⚙️ Settings</h1>
          <p className="page-description">Customize your Smart City System experience</p>
        </div>
        {saved && (
          <div style={{
            background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
          }}>
            ✓ Settings Saved!
          </div>
        )}
      </div>

      {/* Display Settings */}
      <div className="card">
        <h2>🎨 Display Settings</h2>
        <div className="form-group">
          <label>Theme</label>
          <select 
            value={settings.theme} 
            onChange={(e) => handleChange('theme', e.target.value)}
            style={{ fontSize: '16px', padding: '12px' }}
          >
            <option value="light">☀️ Light Mode</option>
            <option value="dark">🌙 Dark Mode</option>
            <option value="auto">🔄 Auto (System Preference)</option>
          </select>
          <small style={{ color: '#7f8c8d', marginTop: '5px', display: 'block' }}>
            {settings.theme === 'auto' 
              ? 'Theme will automatically match your system preference'
              : `Currently using ${settings.theme} mode`}
          </small>
        </div>

        <div className="form-group">
          <label>Language</label>
          <select 
            value={settings.language} 
            onChange={(e) => handleChange('language', e.target.value)}
            style={{ fontSize: '16px', padding: '12px' }}
          >
            <option value="en">🇺🇸 English</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="fr">🇫🇷 French</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.compactMode}
              onChange={(e) => handleChange('compactMode', e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span>Compact Mode (Reduced spacing)</span>
          </label>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.chartAnimation}
              onChange={(e) => handleChange('chartAnimation', e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span>Chart Animations</span>
          </label>
        </div>
      </div>

      <div className="card">
        <h2>🔔 Notification Settings</h2>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span>Enable Notifications</span>
          </label>
        </div>

        {settings.notifications && (
          <>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span>Email Notifications</span>
              </label>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span>Browser Push Notifications</span>
              </label>
              {!settings.pushNotifications && 'Notification' in window && (
                <button 
                  onClick={requestNotificationPermission}
                  className="btn btn-secondary"
                  style={{ marginTop: '10px', fontSize: '14px', padding: '8px 16px' }}
                >
                  Request Permission
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h2>🔄 Data Refresh Settings</h2>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.autoRefresh}
              onChange={(e) => handleChange('autoRefresh', e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span>Auto Refresh Data</span>
          </label>
        </div>
        {settings.autoRefresh && (
          <div className="form-group">
            <label>Refresh Interval (seconds)</label>
            <input 
              type="range"
              min="10"
              max="300"
              step="10"
              value={settings.refreshInterval}
              onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
              style={{ width: '100%', marginTop: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '12px', color: '#7f8c8d' }}>
              <span>10s</span>
              <strong>{settings.refreshInterval}s</strong>
              <span>300s</span>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>🔊 Sound Settings</h2>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.soundEffects}
              onChange={(e) => handleChange('soundEffects', e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span>Sound Effects</span>
          </label>
          <small style={{ color: '#7f8c8d', marginTop: '5px', display: 'block' }}>
            Play sounds for notifications and actions
          </small>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
        <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1, minWidth: '200px' }}>
          💾 Save Settings
        </button>
        <button onClick={resetSettings} className="btn btn-secondary" style={{ flex: 1, minWidth: '200px' }}>
          🔄 Reset to Default
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;
