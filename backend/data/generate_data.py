"""
Data Generation Script for Smart City Resource Optimization System
Generates simulated sensor data for all modules
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_traffic_data(num_days=90):
    """Generate traffic data with vehicle count and peak hours"""
    dates = pd.date_range(start='2024-01-01', periods=num_days*24, freq='H')
    
    data = []
    for date in dates:
        hour = date.hour
        day_of_week = date.dayofweek
        
        # Peak hours: 7-9 AM and 5-7 PM on weekdays
        if day_of_week < 5:  # Weekday
            if hour in [7, 8, 17, 18]:
                base_count = np.random.normal(800, 100)
            elif hour in [9, 10, 16]:
                base_count = np.random.normal(600, 80)
            else:
                base_count = np.random.normal(300, 50)
        else:  # Weekend
            base_count = np.random.normal(400, 60)
        
        vehicle_count = max(0, int(base_count))
        congestion_level = 'High' if vehicle_count > 700 else 'Medium' if vehicle_count > 400 else 'Low'
        
        data.append({
            'timestamp': date,
            'hour': hour,
            'day_of_week': day_of_week,
            'vehicle_count': vehicle_count,
            'congestion_level': congestion_level,
            'temperature': np.random.normal(25, 5),
            'weather': np.random.choice(['Sunny', 'Rainy', 'Cloudy'], p=[0.6, 0.2, 0.2])
        })
    
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/traffic_data.csv', index=False)
    print(f"Generated {len(df)} traffic records")
    return df

def generate_energy_data(num_days=90):
    """Generate energy consumption data"""
    dates = pd.date_range(start='2024-01-01', periods=num_days*24, freq='H')
    
    data = []
    for date in dates:
        hour = date.hour
        month = date.month
        
        # Higher consumption in summer (AC usage) and peak hours
        seasonal_factor = 1.2 if month in [6, 7, 8] else 0.9 if month in [12, 1, 2] else 1.0
        peak_factor = 1.5 if hour in [18, 19, 20] else 1.2 if hour in [7, 8, 9] else 0.8
        
        base_consumption = np.random.normal(500, 50) * seasonal_factor * peak_factor
        consumption = max(0, base_consumption)
        
        data.append({
            'timestamp': date,
            'hour': hour,
            'month': month,
            'consumption_kwh': round(consumption, 2),
            'temperature': np.random.normal(25, 5),
            'population_density': np.random.normal(5000, 500)
        })
    
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/energy_data.csv', index=False)
    print(f"Generated {len(df)} energy records")
    return df

def generate_water_data(num_days=90):
    """Generate water consumption data"""
    dates = pd.date_range(start='2024-01-01', periods=num_days, freq='D')
    
    data = []
    for date in dates:
        day_of_week = date.dayofweek
        month = date.month
        
        # Higher consumption on weekends and in summer
        weekend_factor = 1.2 if day_of_week >= 5 else 1.0
        seasonal_factor = 1.3 if month in [6, 7, 8] else 1.0
        
        base_consumption = np.random.normal(50000, 5000) * weekend_factor * seasonal_factor
        consumption = max(0, base_consumption)
        
        data.append({
            'timestamp': date,
            'day_of_week': day_of_week,
            'month': month,
            'consumption_liters': round(consumption, 2),
            'temperature': np.random.normal(25, 5),
            'precipitation': np.random.normal(5, 2),
            'population': np.random.normal(100000, 5000)
        })
    
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/water_data.csv', index=False)
    print(f"Generated {len(df)} water records")
    return df

def generate_waste_data(num_days=90):
    """Generate waste bin fill level data"""
    dates = pd.date_range(start='2024-01-01', periods=num_days, freq='D')
    
    data = []
    bin_ids = ['BIN_001', 'BIN_002', 'BIN_003', 'BIN_004', 'BIN_005']
    
    for date in dates:
        for bin_id in bin_ids:
            day_of_week = date.dayofweek
            # Higher waste on weekends
            weekend_factor = 1.3 if day_of_week >= 5 else 1.0
            
            fill_level = np.random.normal(60, 15) * weekend_factor
            fill_level = max(0, min(100, fill_level))
            
            data.append({
                'timestamp': date,
                'bin_id': bin_id,
                'fill_level_percent': round(fill_level, 2),
                'location': np.random.choice(['Downtown', 'Residential', 'Commercial', 'Industrial']),
                'waste_type': np.random.choice(['General', 'Recyclable', 'Organic']),
                'collection_needed': 'Yes' if fill_level > 80 else 'No'
            })
    
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/waste_data.csv', index=False)
    print(f"Generated {len(df)} waste records")
    return df

def generate_air_quality_data(num_days=90):
    """Generate air quality data"""
    dates = pd.date_range(start='2024-01-01', periods=num_days, freq='D')
    
    data = []
    for date in dates:
        month = date.month
        day_of_week = date.dayofweek
        
        # Higher pollution in winter (heating) and weekdays (traffic)
        seasonal_factor = 1.2 if month in [12, 1, 2] else 1.0
        weekday_factor = 1.15 if day_of_week < 5 else 1.0
        
        pm25 = np.random.normal(50, 15) * seasonal_factor * weekday_factor
        pm10 = pm25 * 1.5
        no2 = np.random.normal(40, 10) * seasonal_factor
        co = np.random.normal(1.5, 0.3) * seasonal_factor
        
        # Calculate AQI
        if pm25 <= 50:
            aqi = pm25 * 2
            quality = 'Good'
        elif pm25 <= 100:
            aqi = 50 + (pm25 - 50) * 1.5
            quality = 'Moderate'
        elif pm25 <= 150:
            aqi = 100 + (pm25 - 100) * 1.5
            quality = 'Unhealthy for Sensitive'
        else:
            aqi = 150 + (pm25 - 150) * 2
            quality = 'Unhealthy'
        
        data.append({
            'timestamp': date,
            'pm25': round(max(0, pm25), 2),
            'pm10': round(max(0, pm10), 2),
            'no2': round(max(0, no2), 2),
            'co': round(max(0, co), 2),
            'aqi': round(max(0, aqi), 2),
            'quality': quality,
            'temperature': np.random.normal(25, 5),
            'wind_speed': np.random.normal(10, 3)
        })
    
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/air_quality_data.csv', index=False)
    print(f"Generated {len(df)} air quality records")
    return df

if __name__ == '__main__':
    print("Generating simulated sensor data...")
    generate_traffic_data()
    generate_energy_data()
    generate_water_data()
    generate_waste_data()
    generate_air_quality_data()
    print("\nAll data files generated successfully!")





