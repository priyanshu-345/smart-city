"""
Setup script to initialize the Smart City Resource Optimization System
Run this script to generate data and train models
"""

import os
import sys

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

def main():
    print("=" * 60)
    print("Smart City Resource Optimization System - Setup")
    print("=" * 60)
    
    # Ensure we're in the backend directory
    os.chdir(backend_dir)
    
    # Step 1: Generate data
    print("\n[1/2] Generating simulated sensor data...")
    try:
        from data.generate_data import (
            generate_traffic_data,
            generate_energy_data,
            generate_water_data,
            generate_waste_data,
            generate_air_quality_data
        )
        
        generate_traffic_data()
        generate_energy_data()
        generate_water_data()
        generate_waste_data()
        generate_air_quality_data()
        
        print("[OK] Data generation completed")
    except Exception as e:
        print(f"[ERROR] Error generating data: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Step 2: Train models
    print("\n[2/2] Training ML models...")
    try:
        from models.train_models import (
            train_traffic_model,
            train_energy_model,
            train_water_model,
            train_waste_model,
            train_air_quality_model
        )
        
        train_traffic_model()
        train_energy_model()
        train_water_model()
        train_waste_model()
        train_air_quality_model()
        
        print("[OK] Model training completed")
    except Exception as e:
        print(f"[ERROR] Error training models: {e}")
        import traceback
        traceback.print_exc()
        return
    
    print("\n" + "=" * 60)
    print("Setup completed successfully!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Make sure MongoDB is running (optional)")
    print("2. Start the Flask backend: python app.py")
    print("3. Start the React frontend: cd ../frontend && npm start")

if __name__ == '__main__':
    main()

