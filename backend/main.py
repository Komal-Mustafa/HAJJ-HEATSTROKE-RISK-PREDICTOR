"""
Hajj Heatstroke Risk Predictor — FastAPI Backend
Deploy on Render (free tier).

Endpoints:
  GET  /         → health check
  GET  /health   → health check (JSON)
  POST /predict  → risk prediction
"""
import os
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ── Load model artifacts ──────────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

try:
    clf  = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
    le   = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
    meta = joblib.load(os.path.join(MODEL_DIR, "meta.pkl"))
except FileNotFoundError:
    raise RuntimeError(
        "Model files not found. Run  python train_model.py  first."
    )

ZONE_HEAT: dict = meta["zone_heat"]
ZONE_ENC:  dict = meta["zone_enc"]

# ── Risk metadata ─────────────────────────────────────────────────────────────
RISK_COLOR = {
    "EXTREME":  "#8B0000",
    "HIGH":     "#FF4500",
    "MODERATE": "#FF8C00",
    "LOW":      "#DAA520",
    "SAFE":     "#228B22",
}

RISK_ADVICE = {
    "EXTREME": [
        "STOP all outdoor activities immediately",
        "Move to air-conditioned shelter NOW",
        "Call emergency services if feeling faint",
        "Apply cool wet cloths to neck, armpits, groin",
        "Drink water — even if not thirsty",
        "Do NOT leave anyone in a parked vehicle",
    ],
    "HIGH": [
        "Avoid sun exposure between 10 AM – 4 PM",
        "Drink 500 ml water every 30 minutes",
        "Use umbrella and wear loose white clothing",
        "Rest in shaded or air-conditioned areas frequently",
        "Watch companions for confusion or hot/dry skin",
        "Seek medical attention at first sign of illness",
    ],
    "MODERATE": [
        "Limit outdoor rituals to early morning or after sunset",
        "Drink at least 3–4 litres of water daily",
        "Use cooling sprays and damp towels",
        "Wear light, breathable clothing",
        "Locate nearest medical station on your map",
    ],
    "LOW": [
        "Stay hydrated — minimum 2 litres of water daily",
        "Take regular rest breaks in shaded areas",
        "Wear sunscreen SPF 50+",
        "Monitor elderly and sick companions closely",
    ],
    "SAFE": [
        "Normal precautions apply",
        "Stay hydrated throughout the day",
        "Recheck conditions during peak-heat hours (11 AM – 4 PM)",
    ],
}

RISK_ICON = {
    "EXTREME":  "🚨",
    "HIGH":     "⚠️",
    "MODERATE": "🟠",
    "LOW":      "🟡",
    "SAFE":     "✅",
}

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Hajj Heatstroke Risk Predictor API",
    description="Predict heatstroke risk for Hajj pilgrims based on real-time weather conditions.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # lock this down to your Vercel URL in production
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ── Schemas ───────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    temp_celsius: float = Field(..., ge=10,  le=60,  example=44.0,  description="Air temperature in °C")
    humidity:     float = Field(..., ge=0,   le=100, example=25.0,  description="Relative humidity in %")
    month:        int   = Field(..., ge=1,   le=12,  example=7,     description="Month number (1–12)")
    hour:         int   = Field(..., ge=0,   le=23,  example=13,    description="Hour of day in 24-h format")
    zone:         str   = Field(...,                 example="Arafat",
                                description="Hajj zone: Arafat | Mina | Muzdalifa | Jamarat | Masjid")


class PredictResponse(BaseModel):
    risk_level:  str
    feels_like:  float
    color:       str
    icon:        str
    advice:      list[str]
    inputs_echo: dict


# ── Helpers ───────────────────────────────────────────────────────────────────
def compute_feels_like(temp: float, humidity: float, zone: str, hour: int) -> float:
    zone_adj = ZONE_HEAT.get(zone, 1.0)
    hour_adj = 1.5 if 11 <= hour <= 16 else 0.0
    return temp + (humidity / 100) * (temp * 0.15) + zone_adj * 0.3 + hour_adj * 0.5


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"message": "Hajj Heatstroke Risk API is running. POST /predict to get predictions."}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "model": "RandomForestClassifier", "classes": list(le.classes_)}


@app.post("/predict", response_model=PredictResponse, tags=["Prediction"])
def predict(req: PredictRequest):
    if req.zone not in ZONE_ENC:
        raise HTTPException(
            status_code=422,
            detail=f"Zone must be one of: {list(ZONE_ENC.keys())}"
        )

    feels_like = compute_feels_like(req.temp_celsius, req.humidity, req.zone, req.hour)
    zone_enc   = ZONE_ENC[req.zone]

    X = np.array([[req.temp_celsius, req.humidity, req.month, req.hour, zone_enc, feels_like]])
    risk = le.inverse_transform(clf.predict(X))[0]

    return PredictResponse(
        risk_level  = risk,
        feels_like  = round(feels_like, 1),
        color       = RISK_COLOR[risk],
        icon        = RISK_ICON[risk],
        advice      = RISK_ADVICE[risk],
        inputs_echo = req.model_dump(),
    )
