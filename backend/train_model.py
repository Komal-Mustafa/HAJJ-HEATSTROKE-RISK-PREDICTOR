"""
Train and save the Hajj Heatstroke Risk prediction model.
Run this script once to generate model/model.pkl before starting the API.

Usage:
    python train_model.py
"""
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

np.random.seed(42)
N = 15000

# ── Synthetic Hajj weather data ───────────────────────────────────────────────
temp      = np.random.uniform(28, 52, N)   # °C
humidity  = np.random.uniform(10, 65, N)   # %
month     = np.random.choice(range(1, 13), N)
hour      = np.random.randint(0, 24, N)
zones     = ['Arafat', 'Mina', 'Muzdalifa', 'Jamarat', 'Masjid']
zone_arr  = np.random.choice(zones, N)

# Outdoor zones run hotter
ZONE_HEAT = {'Arafat': 1.5, 'Mina': 1.2, 'Muzdalifa': 1.3, 'Jamarat': 1.1, 'Masjid': 0.8}
ZONE_ENC  = {'Arafat': 0,   'Mina': 1,   'Muzdalifa': 2,   'Jamarat': 3,   'Masjid': 4}

zone_adj = np.array([ZONE_HEAT[z] for z in zone_arr])
zone_enc = np.array([ZONE_ENC[z]  for z in zone_arr])

# Peak-heat hours (11 AM – 4 PM) add to effective temperature
hour_adj = np.where((hour >= 11) & (hour <= 16), 1.5, 0.0)

# Simplified heat index: feels_like reflects humidity + zone + time-of-day
feels_like = (
    temp
    + (humidity / 100) * (temp * 0.15)
    + zone_adj * 0.3
    + hour_adj * 0.5
)

# ── Risk labels (WHO / Saudi Health Ministry thresholds) ─────────────────────
def classify(fl):
    if fl > 46:  return 'EXTREME'
    if fl > 43:  return 'HIGH'
    if fl > 40:  return 'MODERATE'
    if fl > 37:  return 'LOW'
    return 'SAFE'

risk = np.array([classify(fl) for fl in feels_like])

# ── Build feature matrix ──────────────────────────────────────────────────────
X = np.column_stack([temp, humidity, month, hour, zone_enc, feels_like])

le = LabelEncoder()
y  = le.fit_transform(risk)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Train ─────────────────────────────────────────────────────────────────────
clf = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)
clf.fit(X_train, y_train)

print("Test accuracy:", round(clf.score(X_test, y_test) * 100, 2), "%")
print("\nClassification Report:")
print(classification_report(y_test, clf.predict(X_test), target_names=le.classes_))

# ── Save artifacts ────────────────────────────────────────────────────────────
os.makedirs("model", exist_ok=True)
joblib.dump(clf, "model/model.pkl")
joblib.dump(le,  "model/label_encoder.pkl")
joblib.dump(
    {
        "features":   ["temp_celsius", "humidity", "month", "hour", "zone_encoded", "feels_like"],
        "zone_heat":  ZONE_HEAT,
        "zone_enc":   ZONE_ENC,
    },
    "model/meta.pkl"
)

print("\nSaved: model/model.pkl  model/label_encoder.pkl  model/meta.pkl")
