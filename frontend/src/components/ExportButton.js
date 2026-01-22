import React, { useState } from 'react';
import { getPredictions } from '../services/api';

const ExportButton = ({ module = null, format = 'csv' }) => {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'object' ? JSON.stringify(value) : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await getPredictions(module, 1000);
      const predictions = response.predictions || [];
      
      if (predictions.length === 0) {
        alert('No data to export');
        return;
      }

      const filename = `smart_city_${module || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(predictions, filename);
    } catch (error) {
      alert('Error exporting data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport}
      disabled={exporting}
      className="btn btn-secondary"
      style={{ 
        padding: '10px 20px',
        fontSize: '14px',
        marginLeft: '10px'
      }}
    >
      {exporting ? '⏳ Exporting...' : '📊 Export CSV'}
    </button>
  );
};

export default ExportButton;

