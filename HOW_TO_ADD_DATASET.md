# Custom Dataset Add Kaise Karein

## 📋 Steps

### Step 1: Dataset Prepare Karein

Aapka dataset **CSV format** me hona chahiye. Har module ke liye required columns:

#### 🚦 Traffic Dataset (`traffic_data.csv`)
**Required Columns:**
- `timestamp` - Date/Time (e.g., "2024-01-01 08:00:00")
- `hour` - Hour of day (0-23) - optional, auto-extract hoga
- `day_of_week` - Day (0-6, Monday=0) - optional, auto-extract hoga
- `month` - Month (1-12) - optional, auto-extract hoga
- `temperature` - Temperature in Celsius
- `weather` - Weather condition (Sunny/Rainy/Cloudy)
- `vehicle_count` - Target variable (number of vehicles)

**Example:**
```csv
timestamp,temperature,weather,vehicle_count
2024-01-01 08:00:00,25,Sunny,750
2024-01-01 09:00:00,26,Sunny,680
```

#### ⚡ Energy Dataset (`energy_data.csv`)
**Required Columns:**
- `timestamp` - Date/Time
- `hour` - Hour (0-23) - optional
- `month` - Month (1-12) - optional
- `temperature` - Temperature
- `population_density` - Population density
- `consumption_kwh` - Target variable (energy consumption)

#### 💧 Water Dataset (`water_data.csv`)
**Required Columns:**
- `timestamp` - Date/Time
- `day_of_week` - Day (0-6) - optional
- `month` - Month (1-12) - optional
- `temperature` - Temperature
- `precipitation` - Precipitation amount
- `population` - Population
- `consumption_liters` - Target variable (water consumption)

#### 🗑️ Waste Dataset (`waste_data.csv`)
**Required Columns:**
- `timestamp` - Date/Time
- `day_of_week` - Day (0-6) - optional
- `location` - Location type (Downtown/Residential/Commercial/Industrial)
- `waste_type` - Waste type (General/Recyclable/Organic)
- `fill_level_percent` - Target variable (0-100)

#### 🌬️ Air Quality Dataset (`air_quality_data.csv`)
**Required Columns:**
- `timestamp` - Date/Time
- `month` - Month (1-12) - optional
- `day_of_week` - Day (0-6) - optional
- `temperature` - Temperature
- `wind_speed` - Wind speed
- `pm25` - PM2.5 value
- `pm10` - PM10 value
- `no2` - NO2 value
- `co` - CO value
- `aqi` - Air Quality Index (optional)
- `quality` - Quality status (Good/Moderate/Unhealthy, optional)

---

### Step 2: Dataset Add Karein

**Option 1: Direct File Copy**
1. Aapka CSV file `backend/data/` folder me copy karein
2. File ka naam standard naam se match karein:
   - `traffic_data.csv`
   - `energy_data.csv`
   - `water_data.csv`
   - `waste_data.csv`
   - `air_quality_data.csv`

**Option 2: Python Script Use Karein**
```python
# backend/data/ folder me jao
cd backend/data

# Python script run karein
python -c "from load_custom_data import load_custom_traffic_data; load_custom_traffic_data('your_file.csv')"
```

---

### Step 3: Models Retrain Karein

Dataset add karne ke baad models ko retrain karna hoga:

```powershell
cd backend
python setup.py
```

Ya manually:
```powershell
cd backend/models
python train_models.py
```

---

### Step 4: Backend Restart Karein

Models retrain hone ke baad backend restart karein:

```powershell
cd backend
python app.py
```

---

## 📝 Example: Custom Traffic Dataset

Agar aapke paas traffic data hai:

1. **CSV file banayein:**
```csv
timestamp,temperature,weather,vehicle_count
2024-01-01 08:00:00,25,Sunny,750
2024-01-01 09:00:00,26,Sunny,680
2024-01-01 10:00:00,27,Cloudy,620
```

2. **File ko copy karein:**
```powershell
copy your_traffic_data.csv backend\data\traffic_data.csv
```

3. **Models retrain karein:**
```powershell
cd backend
python setup.py
```

4. **Backend restart karein**

---

## ⚠️ Important Notes

1. **CSV Format:** Dataset CSV format me hona chahiye
2. **Column Names:** Column names exactly match karein (case-sensitive)
3. **Data Quality:** Missing values handle karein (NaN values remove ya fill karein)
4. **Minimum Data:** At least 50-100 records hona chahiye better predictions ke liye
5. **Timestamp Format:** Timestamp format: `YYYY-MM-DD HH:MM:SS` ya `YYYY-MM-DD`

---

## 🆘 Help

Agar aapko help chahiye:
1. Dataset ka sample share karein
2. Main aapke liye exact code bana dunga
3. Column mapping fix kar dunga

---

## ✅ Checklist

- [ ] Dataset CSV format me hai
- [ ] Required columns present hain
- [ ] File `backend/data/` folder me hai
- [ ] Models retrain kiye hain (`python setup.py`)
- [ ] Backend restart kiya hai

---

**Aap apna dataset share karein, main add kar dunga!** 🚀





