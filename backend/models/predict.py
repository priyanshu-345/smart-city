"""
Prediction Functions for ML Models
"""

import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import os

class ModelPredictor:
    def __init__(self):
        # Get the correct path to models directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.models_path = current_dir
        self.load_models()
    
    def load_models(self):
        """Load all trained models"""
        try:
            import os
            print(f"Loading models from: {self.models_path}")
            
            # Traffic model
            traffic_model_path = os.path.join(self.models_path, 'traffic_model.pkl')
            if not os.path.exists(traffic_model_path):
                raise FileNotFoundError(f"Traffic model not found at {traffic_model_path}. Please run setup.py first.")
            print("Loading traffic model...")
            self.traffic_model = joblib.load(traffic_model_path)
            self.traffic_weather_encoder = joblib.load(os.path.join(self.models_path, 'traffic_weather_encoder.pkl'))
            print("[OK] Traffic model loaded")
            
            # Energy model
            print("Loading energy model...")
            self.energy_model = joblib.load(os.path.join(self.models_path, 'energy_model.pkl'))
            self.energy_scaler = joblib.load(os.path.join(self.models_path, 'energy_scaler.pkl'))
            print("[OK] Energy model loaded")
            
            # Water model
            print("Loading water model...")
            water_model_h5 = os.path.join(self.models_path, 'water_model.h5')
            water_model_pkl = os.path.join(self.models_path, 'water_model.pkl')
            
            if os.path.exists(water_model_h5):
                # LSTM model
                self.water_model = load_model(water_model_h5, compile=False)
                self.water_scaler_X = joblib.load(os.path.join(self.models_path, 'water_scaler_X.pkl'))
                self.water_scaler_y = joblib.load(os.path.join(self.models_path, 'water_scaler_y.pkl'))
                self.water_model_type = 'lstm'
            elif os.path.exists(water_model_pkl):
                # Linear Regression model (fallback)
                self.water_model = joblib.load(water_model_pkl)
                self.water_scaler = joblib.load(os.path.join(self.models_path, 'water_scaler.pkl'))
                self.water_model_type = 'linear'
            else:
                raise FileNotFoundError("Water model not found. Please run setup.py first.")
            print("[OK] Water model loaded")
            
            # Waste model
            print("Loading waste model...")
            self.waste_model = joblib.load(os.path.join(self.models_path, 'waste_model.pkl'))
            self.waste_scaler = joblib.load(os.path.join(self.models_path, 'waste_scaler.pkl'))
            self.waste_location_encoder = joblib.load(os.path.join(self.models_path, 'waste_location_encoder.pkl'))
            self.waste_type_encoder = joblib.load(os.path.join(self.models_path, 'waste_type_encoder.pkl'))
            print("[OK] Waste model loaded")
            
            # Air quality model
            print("Loading air quality model...")
            self.air_quality_model = joblib.load(os.path.join(self.models_path, 'air_quality_model.pkl'))
            self.air_quality_scaler = joblib.load(os.path.join(self.models_path, 'air_quality_scaler.pkl'))
            print("[OK] Air quality model loaded")
            
            print("=" * 50)
            print("[OK] All models loaded successfully!")
            print("=" * 50)
        except Exception as e:
            print(f"[ERROR] Error loading models: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def predict_traffic(self, data):
        """Predict traffic congestion"""
        try:
            # Encode weather
            weather_encoded = self.traffic_weather_encoder.transform([data['weather']])[0]
            
            # Prepare features
            features = np.array([[
                data['hour'],
                data['day_of_week'],
                data['month'],
                data['temperature'],
                weather_encoded
            ]])
            
            # Predict
            prediction = self.traffic_model.predict(features)[0]
            
            # Determine congestion level
            if prediction > 700:
                congestion = 'High'
            elif prediction > 400:
                congestion = 'Medium'
            else:
                congestion = 'Low'
            
            return {
                'predicted_vehicle_count': int(prediction),
                'congestion_level': congestion,
                'status': 'success'
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def predict_energy(self, data):
        """Predict energy consumption"""
        try:
            # Prepare features
            features = np.array([[
                data['hour'],
                data['month'],
                data['temperature'],
                data['population_density']
            ]])
            
            # Scale and predict
            features_scaled = self.energy_scaler.transform(features)
            prediction = self.energy_model.predict(features_scaled)[0]
            
            return {
                'predicted_consumption_kwh': round(float(prediction), 2),
                'status': 'success'
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def predict_water(self, data):
        """Predict water consumption using LSTM or Linear Regression"""
        try:
            # Get the correct path to data directory
            current_dir = os.path.dirname(os.path.abspath(__file__))
            backend_dir = os.path.dirname(current_dir)
            data_path = os.path.join(backend_dir, 'data', 'water_data.csv')
            
            # Load historical data
            df = pd.read_csv(data_path)
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df = df.sort_values('timestamp').tail(7)
            
            if hasattr(self, 'water_model_type') and self.water_model_type == 'lstm':
                # LSTM model prediction
                sequence = df[['day_of_week', 'month', 'temperature', 'precipitation', 'population']].values
                sequence_reshaped = sequence.reshape(-1, sequence.shape[-1])
                sequence_scaled = self.water_scaler_X.transform(sequence_reshaped)
                sequence_scaled = sequence_scaled.reshape(1, 7, 5)
                prediction_scaled = self.water_model.predict(sequence_scaled, verbose=0)
                prediction = self.water_scaler_y.inverse_transform(prediction_scaled)[0][0]
            else:
                # Linear Regression model prediction
                latest = df.iloc[-1]
                features = np.array([[
                    latest['day_of_week'],
                    latest['month'],
                    latest['temperature'],
                    latest['precipitation'],
                    latest['population']
                ]])
                features_scaled = self.water_scaler.transform(features)
                prediction = self.water_model.predict(features_scaled)[0]
            
            return {
                'predicted_consumption_liters': round(float(prediction), 2),
                'status': 'success'
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def predict_waste(self, data):
        """Predict waste bin fill level"""
        try:
            # Encode categorical features
            location_encoded = self.waste_location_encoder.transform([data['location']])[0]
            waste_type_encoded = self.waste_type_encoder.transform([data['waste_type']])[0]
            
            # Prepare features
            features = np.array([[
                data['day_of_week'],
                location_encoded,
                waste_type_encoded
            ]])
            
            # Scale and predict
            features_scaled = self.waste_scaler.transform(features)
            prediction = self.waste_model.predict(features_scaled)[0]
            
            # Clamp between 0 and 100
            prediction = max(0, min(100, prediction))
            collection_needed = 'Yes' if prediction > 80 else 'No'
            
            return {
                'predicted_fill_level_percent': round(float(prediction), 2),
                'collection_needed': collection_needed,
                'status': 'success'
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def predict_air_quality(self, data):
        """Predict air quality"""
        try:
            # Prepare features
            features = np.array([[
                data['month'],
                data['day_of_week'],
                data['temperature'],
                data['wind_speed'],
                data['pm25'],
                data['pm10'],
                data['no2'],
                data['co']
            ]])
            
            # Scale and predict
            features_scaled = self.air_quality_scaler.transform(features)
            prediction = self.air_quality_model.predict(features_scaled)[0]
            
            quality = 'Good/Moderate' if prediction == 1 else 'Unhealthy'
            
            return {
                'predicted_quality': quality,
                'quality_binary': int(prediction),
                'status': 'success'
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

