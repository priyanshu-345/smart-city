"""
Process Smart City Dataset and convert to module-specific formats
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def process_dataset_to_modules():
    """Convert smart city dataset to individual module datasets"""
    
    # Load the dataset
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    dataset_path = os.path.join(backend_dir, 'models', 'smart_city_dataset (1).csv')
    
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return False
    
    print("Loading smart city dataset...")
    df = pd.read_csv(dataset_path)
    print(f"Loaded {len(df)} records with {len(df.columns)} columns")
    
    # Generate timestamps for time series data
    start_date = datetime(2024, 1, 1)
    
    # 1. ENERGY DATA
    print("\nProcessing Energy Data...")
    energy_data = []
    for idx, row in df.iterrows():
        # Create hourly data for each city (sample 24 hours)
        for hour in range(24):
            # Use month from index to vary consumption
            month = (idx % 12) + 1
            # Energy consumption varies by hour and city characteristics
            base_consumption = row['Energy Consumption']
            hour_factor = 1.5 if hour in [18, 19, 20] else 1.2 if hour in [7, 8, 9] else 0.8
            consumption = base_consumption * hour_factor * np.random.uniform(0.9, 1.1)
            
            energy_data.append({
                'timestamp': start_date + timedelta(days=idx, hours=hour),
                'hour': hour,
                'month': month,
                'temperature': np.random.normal(25, 5),
                'population_density': row['Population'] / row['Area (sq. km)'],
                'consumption_kwh': round(consumption, 2)
            })
    
    energy_df = pd.DataFrame(energy_data)
    energy_df.to_csv(os.path.join(os.path.dirname(__file__), 'energy_data.csv'), index=False)
    print(f"[OK] Energy data: {len(energy_df)} records")
    
    # 2. AIR QUALITY DATA
    print("\nProcessing Air Quality Data...")
    air_data = []
    for idx, row in df.iterrows():
        date = start_date + timedelta(days=idx)
        month = date.month
        day_of_week = date.weekday()
        
        # Use Air Quality Index from dataset
        aqi = row['Air Quality Index']
        pm25 = aqi / 2 + np.random.normal(0, 5)
        pm10 = pm25 * 1.5
        no2 = aqi / 2.5 + np.random.normal(0, 3)
        co = aqi / 30 + np.random.normal(0, 0.2)
        
        # Determine quality
        if aqi <= 50:
            quality = 'Good'
        elif aqi <= 100:
            quality = 'Moderate'
        elif aqi <= 150:
            quality = 'Unhealthy for Sensitive'
        else:
            quality = 'Unhealthy'
        
        air_data.append({
            'timestamp': date,
            'month': month,
            'day_of_week': day_of_week,
            'temperature': np.random.normal(25, 5),
            'wind_speed': np.random.normal(10, 3),
            'pm25': round(max(0, pm25), 2),
            'pm10': round(max(0, pm10), 2),
            'no2': round(max(0, no2), 2),
            'co': round(max(0, co), 2),
            'aqi': round(aqi, 2),
            'quality': quality
        })
    
    air_df = pd.DataFrame(air_data)
    air_df.to_csv(os.path.join(os.path.dirname(__file__), 'air_quality_data.csv'), index=False)
    print(f"[OK] Air quality data: {len(air_df)} records")
    
    # 3. WASTE DATA
    print("\nProcessing Waste Data...")
    waste_data = []
    locations = ['Downtown', 'Residential', 'Commercial', 'Industrial']
    waste_types = ['General', 'Recyclable', 'Organic']
    
    for idx, row in df.iterrows():
        date = start_date + timedelta(days=idx)
        day_of_week = date.weekday()
        
        # Use Waste Management Score from dataset
        waste_score = row['Waste Management Score']
        # Lower score = higher fill level
        base_fill = 100 - waste_score + np.random.normal(0, 10)
        fill_level = max(0, min(100, base_fill))
        
        for bin_id in range(1, 6):  # 5 bins per city
            location = locations[bin_id % len(locations)]
            waste_type = waste_types[bin_id % len(waste_types)]
            
            waste_data.append({
                'timestamp': date,
                'bin_id': f'BIN_{idx}_{bin_id}',
                'fill_level_percent': round(fill_level, 2),
                'location': location,
                'waste_type': waste_type,
                'day_of_week': day_of_week,
                'collection_needed': 'Yes' if fill_level > 80 else 'No'
            })
    
    waste_df = pd.DataFrame(waste_data)
    waste_df.to_csv(os.path.join(os.path.dirname(__file__), 'waste_data.csv'), index=False)
    print(f"[OK] Waste data: {len(waste_df)} records")
    
    # 4. TRAFFIC DATA
    print("\nProcessing Traffic Data...")
    traffic_data = []
    for idx, row in df.iterrows():
        # Create hourly data
        for hour in range(24):
            date = start_date + timedelta(days=idx, hours=hour)
            day_of_week = date.weekday()
            month = date.month
            
            # Use Public Transport Usage as indicator (lower usage = more traffic)
            transport_usage = row['Public Transport Usage']
            # Inverse relationship: high transport usage = less vehicle traffic
            base_count = (100 - transport_usage) * 10 + np.random.normal(0, 50)
            
            # Peak hours adjustment
            if day_of_week < 5:  # Weekday
                if hour in [7, 8, 17, 18]:
                    base_count *= 1.3
                elif hour in [9, 10, 16]:
                    base_count *= 1.1
            
            vehicle_count = max(0, int(base_count))
            congestion_level = 'High' if vehicle_count > 700 else 'Medium' if vehicle_count > 400 else 'Low'
            
            traffic_data.append({
                'timestamp': date,
                'hour': hour,
                'day_of_week': day_of_week,
                'month': month,
                'vehicle_count': vehicle_count,
                'congestion_level': congestion_level,
                'temperature': np.random.normal(25, 5),
                'weather': np.random.choice(['Sunny', 'Rainy', 'Cloudy'], p=[0.6, 0.2, 0.2])
            })
    
    traffic_df = pd.DataFrame(traffic_data)
    traffic_df.to_csv(os.path.join(os.path.dirname(__file__), 'traffic_data.csv'), index=False)
    print(f"[OK] Traffic data: {len(traffic_df)} records")
    
    # 5. WATER DATA
    print("\nProcessing Water Data...")
    water_data = []
    for idx, row in df.iterrows():
        date = start_date + timedelta(days=idx)
        day_of_week = date.weekday()
        month = date.month
        
        # Water consumption based on population and area
        population = row['Population']
        area = row['Area (sq. km)']
        # Base consumption per person per day (liters)
        per_person_consumption = np.random.normal(150, 20)
        consumption = population * per_person_consumption / 1000  # Convert to thousands of liters
        
        # Seasonal and weekend adjustments
        if month in [6, 7, 8]:  # Summer
            consumption *= 1.2
        if day_of_week >= 5:  # Weekend
            consumption *= 1.1
        
        water_data.append({
            'timestamp': date,
            'day_of_week': day_of_week,
            'month': month,
            'consumption_liters': round(consumption, 2),
            'temperature': np.random.normal(25, 5),
            'precipitation': np.random.normal(5, 2),
            'population': int(population)
        })
    
    water_df = pd.DataFrame(water_data)
    water_df.to_csv(os.path.join(os.path.dirname(__file__), 'water_data.csv'), index=False)
    print(f"[OK] Water data: {len(water_df)} records")
    
    print("\n" + "=" * 60)
    print("[OK] All module datasets created successfully!")
    print("=" * 60)
    print("\nNext step: Retrain models")
    print("Run: cd backend && python setup.py")
    print("=" * 60)
    
    return True

if __name__ == '__main__':
    process_dataset_to_modules()

