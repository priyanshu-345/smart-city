"""
ML Model Training Script
Trains models for all modules: Traffic, Energy, Water, Waste, Air Quality
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score
# TensorFlow imports - will be imported only if needed
try:
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout
    from tensorflow.keras.optimizers import Adam
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
import warnings
warnings.filterwarnings('ignore')

def train_traffic_model():
    """Train Random Forest model for traffic prediction"""
    print("Training Traffic Model (Random Forest)...")
    
    # Get the correct path to data directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    data_path = os.path.join(backend_dir, 'data', 'traffic_data.csv')
    
    df = pd.read_csv(data_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['month'] = df['timestamp'].dt.month
    
    # Encode categorical features
    le_weather = LabelEncoder()
    df['weather_encoded'] = le_weather.fit_transform(df['weather'])
    
    # Features
    X = df[['hour', 'day_of_week', 'month', 'temperature', 'weather_encoded']]
    y = df['vehicle_count']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"  MSE: {mse:.2f}, R²: {r2:.4f}")
    
    # Save model and encoders
    current_dir = os.path.dirname(os.path.abspath(__file__))
    joblib.dump(model, os.path.join(current_dir, 'traffic_model.pkl'))
    joblib.dump(le_weather, os.path.join(current_dir, 'traffic_weather_encoder.pkl'))
    print("  Model saved successfully")
    return model

def train_energy_model():
    """Train Linear Regression model for energy prediction"""
    print("Training Energy Model (Linear Regression)...")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    data_path = os.path.join(backend_dir, 'data', 'energy_data.csv')
    
    df = pd.read_csv(data_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['month'] = df['timestamp'].dt.month
    
    # Features
    X = df[['hour', 'month', 'temperature', 'population_density']]
    y = df['consumption_kwh']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"  MSE: {mse:.2f}, R²: {r2:.4f}")
    
    # Save model and scaler
    current_dir = os.path.dirname(os.path.abspath(__file__))
    joblib.dump(model, os.path.join(current_dir, 'energy_model.pkl'))
    joblib.dump(scaler, os.path.join(current_dir, 'energy_scaler.pkl'))
    print("  Model saved successfully")
    return model

def train_water_model():
    """Train LSTM model for water prediction"""
    print("Training Water Model (LSTM)...")
    
    try:
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import LSTM, Dense, Dropout
        from tensorflow.keras.optimizers import Adam
    except ImportError as e:
        print(f"  Warning: TensorFlow not available ({e})")
        print("  Skipping water model training. Using Linear Regression instead.")
        return train_water_model_simple()
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    data_path = os.path.join(backend_dir, 'data', 'water_data.csv')
    
    df = pd.read_csv(data_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')
    
    # Features
    features = ['day_of_week', 'month', 'temperature', 'precipitation', 'population']
    target = 'consumption_liters'
    
    # Prepare data for LSTM (sequence of 7 days)
    sequence_length = 7
    X, y = [], []
    
    for i in range(sequence_length, len(df)):
        X.append(df[features].iloc[i-sequence_length:i].values)
        y.append(df[target].iloc[i])
    
    X = np.array(X)
    y = np.array(y)
    
    # Normalize
    scaler_X = StandardScaler()
    scaler_y = StandardScaler()
    
    X_reshaped = X.reshape(-1, X.shape[-1])
    X_scaled = scaler_X.fit_transform(X_reshaped)
    X_scaled = X_scaled.reshape(X.shape)
    
    y_scaled = scaler_y.fit_transform(y.reshape(-1, 1)).flatten()
    
    # Split data
    split_idx = int(len(X) * 0.8)
    X_train, X_test = X_scaled[:split_idx], X_scaled[split_idx:]
    y_train, y_test = y_scaled[:split_idx], y_scaled[split_idx:]
    
    # Build LSTM model
    model = Sequential([
        LSTM(50, activation='relu', input_shape=(sequence_length, len(features)), return_sequences=True),
        Dropout(0.2),
        LSTM(50, activation='relu'),
        Dropout(0.2),
        Dense(1)
    ])
    
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
    
    # Train
    model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.2, verbose=0)
    
    # Evaluate
    y_pred_scaled = model.predict(X_test, verbose=0)
    y_pred = scaler_y.inverse_transform(y_pred_scaled.reshape(-1, 1)).flatten()
    y_test_actual = scaler_y.inverse_transform(y_test.reshape(-1, 1)).flatten()
    
    mse = mean_squared_error(y_test_actual, y_pred)
    r2 = r2_score(y_test_actual, y_pred)
    print(f"  MSE: {mse:.2f}, R²: {r2:.4f}")
    
    # Save model and scalers
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model.save(os.path.join(current_dir, 'water_model.h5'))
    joblib.dump(scaler_X, os.path.join(current_dir, 'water_scaler_X.pkl'))
    joblib.dump(scaler_y, os.path.join(current_dir, 'water_scaler_y.pkl'))
    print("  Model saved successfully")
    return model

def train_waste_model():
    """Train KNN model for waste prediction"""
    print("Training Waste Model (KNN)...")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    data_path = os.path.join(backend_dir, 'data', 'waste_data.csv')
    
    df = pd.read_csv(data_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    
    # Encode categorical features
    le_location = LabelEncoder()
    le_waste_type = LabelEncoder()
    df['location_encoded'] = le_location.fit_transform(df['location'])
    df['waste_type_encoded'] = le_waste_type.fit_transform(df['waste_type'])
    
    # Features
    X = df[['day_of_week', 'location_encoded', 'waste_type_encoded']]
    y = df['fill_level_percent']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = KNeighborsRegressor(n_neighbors=5)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"  MSE: {mse:.2f}, R²: {r2:.4f}")
    
    # Save model and encoders
    current_dir = os.path.dirname(os.path.abspath(__file__))
    joblib.dump(model, os.path.join(current_dir, 'waste_model.pkl'))
    joblib.dump(scaler, os.path.join(current_dir, 'waste_scaler.pkl'))
    joblib.dump(le_location, os.path.join(current_dir, 'waste_location_encoder.pkl'))
    joblib.dump(le_waste_type, os.path.join(current_dir, 'waste_type_encoder.pkl'))
    print("  Model saved successfully")
    return model

def train_air_quality_model():
    """Train Logistic Regression model for air quality classification"""
    print("Training Air Quality Model (Logistic Regression)...")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    data_path = os.path.join(backend_dir, 'data', 'air_quality_data.csv')
    
    df = pd.read_csv(data_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['month'] = df['timestamp'].dt.month
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    
    # Create binary classification: Good/Moderate vs Unhealthy
    df['quality_binary'] = (df['quality'].isin(['Good', 'Moderate'])).astype(int)
    
    # Features
    X = df[['month', 'day_of_week', 'temperature', 'wind_speed', 'pm25', 'pm10', 'no2', 'co']]
    y = df['quality_binary']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"  Accuracy: {accuracy:.4f}")
    
    # Save model and scaler
    current_dir = os.path.dirname(os.path.abspath(__file__))
    joblib.dump(model, os.path.join(current_dir, 'air_quality_model.pkl'))
    joblib.dump(scaler, os.path.join(current_dir, 'air_quality_scaler.pkl'))
    print("  Model saved successfully")
    return model

if __name__ == '__main__':
    print("=" * 50)
    print("Training ML Models for Smart City System")
    print("=" * 50)
    
    # Ensure data exists
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    data_path = os.path.join(backend_dir, 'data', 'traffic_data.csv')
    
    if not os.path.exists(data_path):
        print("Data files not found. Please run generate_data.py first.")
        exit(1)
    
    # Train all models
    train_traffic_model()
    train_energy_model()
    train_water_model()
    train_waste_model()
    train_air_quality_model()
    
    print("\n" + "=" * 50)
    print("All models trained successfully!")
    print("=" * 50)

