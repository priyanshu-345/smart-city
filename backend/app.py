"""
Flask Backend for Smart City Resource Optimization System
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv
import sys

# Add models directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from models.predict import ModelPredictor

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# In-memory storage for predictions (session-based)
predictions_storage = {
    'traffic': [],
    'energy': [],
    'water': [],
    'waste': [],
    'air': []
}

# No database - session-based only
print("[OK] Running in SESSION MODE (in-memory storage)")

# Initialize ML models
predictor = None
print("\n" + "=" * 60)
print("Initializing ML Models...")
print("=" * 60)
try:
    predictor = ModelPredictor()
    print("\n[OK] ML models initialized successfully!")
    print("=" * 60 + "\n")
except Exception as e:
    print("\n" + "=" * 60)
    print("[ERROR] Failed to initialize ML models")
    print(f"Error: {e}")
    print("=" * 60)
    print("\n[WARNING] Backend will start but predictions will NOT work.")
    print("[WARNING] To fix this, run: cd backend && python setup.py")
    print("=" * 60 + "\n")
    predictor = None

# No authentication required - session-based only

@app.route('/')
def home():
    return jsonify({
        'message': 'Smart City Resource Optimization API',
        'version': '1.0.0',
        'endpoints': {
            'traffic': '/predict/traffic',
            'energy': '/predict/energy',
            'water': '/predict/water',
            'waste': '/predict/waste',
            'air': '/predict/air'
        }
    })

@app.route('/api/register', methods=['POST'])
def register():
    """User registration - session-based only"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        username = data.get('username')
        password = data.get('password')
        email = data.get('email', '')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        # Session-based - always allow registration
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """User login - session-based only"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        # Session-based - accept any credentials
        return jsonify({
            'message': 'Login successful',
            'username': username
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/traffic', methods=['POST'])
def predict_traffic():
    """Predict traffic congestion"""
    try:
        if not predictor:
            return jsonify({'error': 'ML models not loaded'}), 500
        
        data = request.json
        
        # Validate required fields
        required_fields = ['hour', 'day_of_week', 'month', 'temperature', 'weather']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Make prediction
        result = predictor.predict_traffic(data)
        
        # Store prediction in memory
        prediction_record = {
            'timestamp': datetime.now().isoformat(),
            'input': data,
            'result': result
        }
        predictions_storage['traffic'].append(prediction_record)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/energy', methods=['POST'])
def predict_energy():
    """Predict energy consumption"""
    try:
        if not predictor:
            return jsonify({'error': 'ML models not loaded'}), 500
        
        data = request.json
        
        # Validate required fields
        required_fields = ['hour', 'month', 'temperature', 'population_density']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Make prediction
        result = predictor.predict_energy(data)
        
        # Store prediction in memory
        prediction_record = {
            'timestamp': datetime.now().isoformat(),
            'input': data,
            'result': result
        }
        predictions_storage['energy'].append(prediction_record)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/water', methods=['POST'])
def predict_water():
    """Predict water consumption"""
    try:
        if not predictor:
            return jsonify({'error': 'ML models not loaded'}), 500
        
        # Water prediction uses historical data, so minimal input needed
        result = predictor.predict_water({})
        
        # Store prediction in memory
        prediction_record = {
            'timestamp': datetime.now().isoformat(),
            'input': {},
            'result': result
        }
        predictions_storage['water'].append(prediction_record)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/waste', methods=['POST'])
def predict_waste():
    """Predict waste bin fill level"""
    try:
        if not predictor:
            return jsonify({'error': 'ML models not loaded'}), 500
        
        data = request.json
        
        # Validate required fields
        required_fields = ['day_of_week', 'location', 'waste_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Make prediction
        result = predictor.predict_waste(data)
        
        # Store prediction in memory
        prediction_record = {
            'timestamp': datetime.now().isoformat(),
            'input': data,
            'result': result
        }
        predictions_storage['waste'].append(prediction_record)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/air', methods=['POST'])
def predict_air():
    """Predict air quality"""
    try:
        if not predictor:
            return jsonify({'error': 'ML models not loaded'}), 500
        
        data = request.json
        
        # Validate required fields
        required_fields = ['month', 'day_of_week', 'temperature', 'wind_speed', 'pm25', 'pm10', 'no2', 'co']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Make prediction
        result = predictor.predict_air_quality(data)
        
        # Store prediction in memory
        prediction_record = {
            'timestamp': datetime.now().isoformat(),
            'input': data,
            'result': result
        }
        predictions_storage['air'].append(prediction_record)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    """Get predictions - session-based only"""
    try:
        module = request.args.get('module')
        limit = int(request.args.get('limit', 100))
        
        if module and module in predictions_storage:
            predictions = predictions_storage[module][-limit:]
        else:
            # Return all predictions from all modules
            all_predictions = []
            for mod, preds in predictions_storage.items():
                for pred in preds[-limit:]:
                    all_predictions.append({
                        'module': mod,
                        **pred
                    })
            predictions = all_predictions[-limit:]
        
        return jsonify({'predictions': predictions}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-pdf', methods=['GET'])
def generate_pdf_report():
    """Generate PDF report - session-based only (empty data)"""
    try:
        from utils.pdf_generator import PDFReportGenerator
        import tempfile
        
        # Calculate stats from stored predictions
        traffic_preds = predictions_storage['traffic']
        energy_preds = predictions_storage['energy']
        water_preds = predictions_storage['water']
        waste_preds = predictions_storage['waste']
        air_preds = predictions_storage['air']
        
        traffic_high = sum(1 for p in traffic_preds if p['result'].get('congestion_level') == 'High')
        energy_consumptions = [p['result'].get('predicted_consumption_kwh', 0) for p in energy_preds if p['result'].get('status') == 'success']
        energy_avg = sum(energy_consumptions) / len(energy_consumptions) if energy_consumptions else 0
        water_consumptions = [p['result'].get('predicted_consumption_liters', 0) for p in water_preds if p['result'].get('status') == 'success']
        water_avg = sum(water_consumptions) / len(water_consumptions) if water_consumptions else 0
        waste_collections = sum(1 for p in waste_preds if p['result'].get('collection_needed') == 'Yes')
        air_unhealthy = sum(1 for p in air_preds if p['result'].get('quality_binary') == 0)
        
        stats_data = {
            'traffic': {'total': len(traffic_preds), 'high_congestion': traffic_high},
            'energy': {'total': len(energy_preds), 'avg_consumption': round(energy_avg, 2)},
            'water': {'total': len(water_preds), 'avg_consumption': round(water_avg, 2)},
            'waste': {'total': len(waste_preds), 'collection_needed': waste_collections},
            'air': {'total': len(air_preds), 'unhealthy_days': air_unhealthy},
            'total_predictions': len(traffic_preds) + len(energy_preds) + len(water_preds) + len(waste_preds) + len(air_preds)
        }
        
        # Collect all predictions for PDF
        all_predictions = []
        for module, preds in predictions_storage.items():
            for pred in preds:
                all_predictions.append({
                    'module': module,
                    'timestamp': pred['timestamp'],
                    'input': pred['input'],
                    'result': pred['result']
                })
        
        # Generate PDF
        generator = PDFReportGenerator()
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf', dir='.')
        pdf_path = temp_file.name
        temp_file.close()
        
        generator.generate_report(stats_data, all_predictions, pdf_path)
        
        # Return PDF file
        from flask import send_file
        return send_file(
            pdf_path,
            as_attachment=True,
            download_name=f'smart_city_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf',
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({'error': f'Error generating PDF: {str(e)}'}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics for dashboard - calculated from stored predictions"""
    try:
        # Calculate stats from stored predictions
        traffic_preds = predictions_storage['traffic']
        energy_preds = predictions_storage['energy']
        water_preds = predictions_storage['water']
        waste_preds = predictions_storage['waste']
        air_preds = predictions_storage['air']
        
        # Traffic stats
        traffic_high = sum(1 for p in traffic_preds if p['result'].get('congestion_level') == 'High')
        
        # Energy stats
        energy_consumptions = [p['result'].get('predicted_consumption_kwh', 0) for p in energy_preds if p['result'].get('status') == 'success']
        energy_avg = sum(energy_consumptions) / len(energy_consumptions) if energy_consumptions else 0
        
        # Water stats
        water_consumptions = [p['result'].get('predicted_consumption_liters', 0) for p in water_preds if p['result'].get('status') == 'success']
        water_avg = sum(water_consumptions) / len(water_consumptions) if water_consumptions else 0
        
        # Waste stats
        waste_collections = sum(1 for p in waste_preds if p['result'].get('collection_needed') == 'Yes')
        
        # Air stats
        air_unhealthy = sum(1 for p in air_preds if p['result'].get('quality_binary') == 0)
        
        return jsonify({
            'traffic': {
                'total': len(traffic_preds),
                'high_congestion': traffic_high
            },
            'energy': {
                'total': len(energy_preds),
                'avg_consumption': round(energy_avg, 2)
            },
            'water': {
                'total': len(water_preds),
                'avg_consumption': round(water_avg, 2)
            },
            'waste': {
                'total': len(waste_preds),
                'collection_needed': waste_collections
            },
            'air': {
                'total': len(air_preds),
                'unhealthy_days': air_unhealthy
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('data', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    print("Starting Smart City Resource Optimization API...")
    print("API running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)

