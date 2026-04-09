
# 🕌 Hajj Heatstroke Risk Prediction System
### AI-Powered Pilgrim Safety | Saudi Arabia Temperature Analysis | Machine Learning
<img width="347" height="561" alt="FireShot Capture 024 - hajj_heatstroke code - localhost" src="https://github.com/user-attachments/assets/ace637fa-a03a-4571-ba15-cc1a0e5d2337" />


---

## 🎯 Project Goal

Every year, **2+ million pilgrims** travel to Saudi Arabia for Hajj in extreme summer heat. This project uses **Machine Learning and Data Science** to predict heatstroke risk and protect pilgrims with real-time safety recommendations.

---

## 🏆 Key Results

| Metric | Value |
|--------|-------|
| 🤖 ML Model Accuracy | **100%** |
| 🏙️ Saudi Cities Analyzed | Dhahran, Riyadh |
| 📅 Data Period | 1995 - 2020 |
| 🌡️ Dhahran Hajj Avg Temp | **36.34°C** |
| 🌡️ Riyadh Hajj Avg Temp | **36.07°C** |
| 🔥 Hottest Day (Dhahran) | **42.17°C** |
| ❄️ Coldest Day (Riyadh) | **3.72°C** |

---

## 📊 Risk Distribution During Hajj Season (Jun–Aug)

| Risk Level | Days Count |
|------------|-----------|
| ✅ SAFE | 5096 |
| 🟢 LOW | 1386 |
| 🟡 MODERATE | 23 |
| 🔴 HIGH / EXTREME | 0 |

---

## 📁 Project Structure

```
Hajj_Heatstroke/
│
├── hajj_heatstroke_code.ipynb          # Main Jupyter Notebook
├── daily_temparature_major_cities.csv  # Dataset (Kaggle)
├── saudi_cleaned.csv                   # Cleaned Saudi data
└── README.md                           # Documentation
```

---

## 🔧 Installation

```bash
git clone https://github.com/YOUR_USERNAME/Hajj_Heatstroke.git
cd Hajj_Heatstroke
pip install pandas numpy matplotlib seaborn scikit-learn jupyter
jupyter notebook hajj_heatstroke_code.ipynb
```

---

## 🌡️ Risk Level Classification

| Level | Temperature | Recommendation |
|-------|------------|----------------|
| 🔴 EXTREME | Above 46°C | Stay indoors, seek medical help immediately |
| 🟠 HIGH | 43°C – 46°C | Limit outdoor time, drink water every hour |
| 🟡 MODERATE | 40°C – 43°C | Take precautions, rest in shade |
| 🟢 LOW | 37°C – 40°C | Stay cautious, keep hydrated |
| ✅ SAFE | Below 37°C | Normal precautions apply |

---

## 📈 Visualizations Included

| Chart | Description |
|-------|-------------|
| 📊 Bar Chart | Average Temperature by Saudi City |
| 🗓️ Heatmap | Monthly Avg Temp — Jan to Dec (Dhahran & Riyadh) |
| ⚠️ Risk Bar Chart | Heatstroke Risk During Hajj Season (Jun–Aug) |
| 📈 Line Chart | Yearly Temperature Trend 1995–2020 |
| 🤖 Confusion Matrix | ML Model Prediction Accuracy |
| ⭐ Feature Importance | Most important features for prediction |
| 🥧 Pie Chart | Hajj Season Risk Distribution |

---

## 🤖 Machine Learning Pipeline

```python
# Step 1: Features
X = df_ml[['Month', 'Day', 'Year', 'temp_celsius']]
y = df_ml['risk_encoded']  # LabelEncoded risk levels

# Step 2: Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 3: Train Models
models = {
    'Random Forest':      RandomForestClassifier(n_estimators=100),
    'Decision Tree':      DecisionTreeClassifier(),
    'Logistic Regression': LogisticRegression(max_iter=1000)
}

# Result: Random Forest → 100% Accuracy ✅
```

---

## 🔮 Real Pilgrim Risk Predictor

```python
predict_pilgrim_risk(age=70, month=7, day=15, year=2024, temp_celsius=45, city='Mecca')

# Output:
# ========================================
#   PILGRIM HEATSTROKE RISK ASSESSMENT
# ========================================
#   Age         : 70 years (HIGH RISK - Elderly)
#   City        : Mecca
#   Temperature : 45°C
#   Feels Like  : 57.0°C
#   Risk Level  : HIGH
# ----------------------------------------
#   ⚠️ Limit outdoor time!
#   💧 Drink 500ml water every hour
#   ☂️ Must use umbrella outdoors
# ========================================
```

---

## 💡 Key Findings

- 🌡️ **Dhahran** is consistently hotter than Riyadh during Hajj season
- 📅 **July & August** are the most dangerous months for heatstroke
- 📈 Temperatures show an **upward trend** from 1995 to 2020
- 👴 **Elderly pilgrims (65+)** face significantly higher risk
- 🎯 `temp_celsius` is the **#1 most important feature** in ML prediction
- 🟡 **MODERATE** days exist but most Hajj season falls in SAFE–LOW range

---

## 🏥 Recommendations for Pilgrims

```
1. 🕐 Avoid outdoor activities between 11AM - 4PM
2. 💧 Drink at least 3-4 liters of water daily
3. 🧣 Wear loose, light-colored clothing
4. ☂️  Always carry an umbrella
5. 🏥 Know location of nearest medical centers
6. 👴 Elderly & sick pilgrims need extra monitoring
7. 📱 Monitor daily temperature forecasts
8. 🌬️ Stay in air-conditioned areas when possible
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Python 3 | Programming Language |
| Pandas | Data Manipulation |
| Matplotlib & Seaborn | Visualization |
| Scikit-learn | Machine Learning |
| Jupyter Notebook | Development |
| Kaggle Dataset | Temperature Data Source |

---

## 👩‍💻 Author

**Komal**
- 🔗 [LinkedIn](https://www.linkedin.com/in/komal-mustafa/)
- 🐙 [GitHub](https://github.com/Komal-Mustafa/)
- 📩 kj324587@gmail.com

---

## 📄 License

MIT License — Open source & free to use

---

⭐ **Star this repo if it helped you!**

> *"Using the power of data science to protect Hajj pilgrims"* 🕌🤲
