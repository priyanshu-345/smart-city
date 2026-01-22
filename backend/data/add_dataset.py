"""
Quick Script to Add Your Custom Dataset
Yeh script use karein apna dataset add karne ke liye
"""

import pandas as pd
import os
import sys

def add_dataset():
    print("=" * 60)
    print("Custom Dataset Adder")
    print("=" * 60)
    print("\nAap kaun sa dataset add karna chahte hain?")
    print("1. Traffic Data")
    print("2. Energy Data")
    print("3. Water Data")
    print("4. Waste Data")
    print("5. Air Quality Data")
    
    choice = input("\nEnter choice (1-5): ").strip()
    
    file_path = input("\nDataset file ka path enter karein (CSV file): ").strip()
    
    if not os.path.exists(file_path):
        print(f"✗ Error: File not found: {file_path}")
        return
    
    try:
        if choice == '1':
            from load_custom_data import load_custom_traffic_data
            load_custom_traffic_data(file_path)
        elif choice == '2':
            from load_custom_data import load_custom_energy_data
            load_custom_energy_data(file_path)
        elif choice == '3':
            from load_custom_data import load_custom_water_data
            load_custom_water_data(file_path)
        elif choice == '4':
            from load_custom_data import load_custom_waste_data
            load_custom_waste_data(file_path)
        elif choice == '5':
            from load_custom_data import load_custom_air_quality_data
            load_custom_air_quality_data(file_path)
        else:
            print("✗ Invalid choice!")
            return
        
        print("\n" + "=" * 60)
        print("✓ Dataset successfully added!")
        print("=" * 60)
        print("\nAb models ko retrain karein:")
        print("  cd backend")
        print("  python setup.py")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    add_dataset()





