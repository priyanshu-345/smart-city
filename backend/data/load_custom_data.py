"""
Custom Dataset Loader
Aap apna dataset yahan add kar sakte hain
"""

import pandas as pd
import os

def load_custom_traffic_data(file_path):
    """
    Custom traffic dataset load karein
    
    Required columns:
    - timestamp (datetime)
    - hour (0-23)
    - day_of_week (0-6, Monday=0)
    - month (1-12)
    - temperature (numeric)
    - weather (Sunny/Rainy/Cloudy)
    - vehicle_count (target variable)
    """
    df = pd.read_csv(file_path)
    
    # Ensure timestamp column exists
    if 'timestamp' not in df.columns:
        raise ValueError("Dataset me 'timestamp' column hona chahiye")
    
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Extract features if not present
    if 'hour' not in df.columns:
        df['hour'] = df['timestamp'].dt.hour
    if 'day_of_week' not in df.columns:
        df['day_of_week'] = df['timestamp'].dt.dayofweek
    if 'month' not in df.columns:
        df['month'] = df['timestamp'].dt.month
    
    # Save to standard location
    output_path = os.path.join(os.path.dirname(__file__), 'traffic_data.csv')
    df.to_csv(output_path, index=False)
    print(f"✓ Custom traffic data loaded and saved to {output_path}")
    return df

def load_custom_energy_data(file_path):
    """
    Custom energy dataset load karein
    
    Required columns:
    - timestamp (datetime)
    - hour (0-23)
    - month (1-12)
    - temperature (numeric)
    - population_density (numeric)
    - consumption_kwh (target variable)
    """
    df = pd.read_csv(file_path)
    
    if 'timestamp' not in df.columns:
        raise ValueError("Dataset me 'timestamp' column hona chahiye")
    
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    if 'hour' not in df.columns:
        df['hour'] = df['timestamp'].dt.hour
    if 'month' not in df.columns:
        df['month'] = df['timestamp'].dt.month
    
    output_path = os.path.join(os.path.dirname(__file__), 'energy_data.csv')
    df.to_csv(output_path, index=False)
    print(f"✓ Custom energy data loaded and saved to {output_path}")
    return df

def load_custom_water_data(file_path):
    """
    Custom water dataset load karein
    
    Required columns:
    - timestamp (datetime)
    - day_of_week (0-6)
    - month (1-12)
    - temperature (numeric)
    - precipitation (numeric)
    - population (numeric)
    - consumption_liters (target variable)
    """
    df = pd.read_csv(file_path)
    
    if 'timestamp' not in df.columns:
        raise ValueError("Dataset me 'timestamp' column hona chahiye")
    
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    if 'day_of_week' not in df.columns:
        df['day_of_week'] = df['timestamp'].dt.dayofweek
    if 'month' not in df.columns:
        df['month'] = df['timestamp'].dt.month
    
    output_path = os.path.join(os.path.dirname(__file__), 'water_data.csv')
    df.to_csv(output_path, index=False)
    print(f"✓ Custom water data loaded and saved to {output_path}")
    return df

def load_custom_waste_data(file_path):
    """
    Custom waste dataset load karein
    
    Required columns:
    - timestamp (datetime)
    - bin_id (string, optional)
    - day_of_week (0-6)
    - location (Downtown/Residential/Commercial/Industrial)
    - waste_type (General/Recyclable/Organic)
    - fill_level_percent (target variable, 0-100)
    """
    df = pd.read_csv(file_path)
    
    if 'timestamp' not in df.columns:
        raise ValueError("Dataset me 'timestamp' column hona chahiye")
    
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    if 'day_of_week' not in df.columns:
        df['day_of_week'] = df['timestamp'].dt.dayofweek
    
    output_path = os.path.join(os.path.dirname(__file__), 'waste_data.csv')
    df.to_csv(output_path, index=False)
    print(f"✓ Custom waste data loaded and saved to {output_path}")
    return df

def load_custom_air_quality_data(file_path):
    """
    Custom air quality dataset load karein
    
    Required columns:
    - timestamp (datetime)
    - month (1-12)
    - day_of_week (0-6)
    - temperature (numeric)
    - wind_speed (numeric)
    - pm25 (numeric)
    - pm10 (numeric)
    - no2 (numeric)
    - co (numeric)
    - aqi (optional, numeric)
    - quality (Good/Moderate/Unhealthy, optional)
    """
    df = pd.read_csv(file_path)
    
    if 'timestamp' not in df.columns:
        raise ValueError("Dataset me 'timestamp' column hona chahiye")
    
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    if 'month' not in df.columns:
        df['month'] = df['timestamp'].dt.month
    if 'day_of_week' not in df.columns:
        df['day_of_week'] = df['timestamp'].dt.dayofweek
    
    output_path = os.path.join(os.path.dirname(__file__), 'air_quality_data.csv')
    df.to_csv(output_path, index=False)
    print(f"✓ Custom air quality data loaded and saved to {output_path}")
    return df

if __name__ == '__main__':
    print("=" * 60)
    print("Custom Dataset Loader")
    print("=" * 60)
    print("\nAap apna dataset CSV format me provide karein.")
    print("Example usage:")
    print("  load_custom_traffic_data('my_traffic_data.csv')")
    print("\nDataset ko 'backend/data/' folder me rakhein.")
    print("=" * 60)





