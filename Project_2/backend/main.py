from typing import Literal
import os

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Binge Eating Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "binge_eating_model.joblib")
model = joblib.load(MODEL_PATH)

FEATURE_COLUMNS = [
    "Age",
    "Gender(0,1)",
    "BMI",
    "Weight(kg)",
    "Waist(cm)",
    "Eduction(0,1,2)",
    "Alcohol",
    "T2D",
    "Sleep apnea syndrome",
    "Gastroesophageal reflux disease",
    "EDE-Q score (Per-operation)",
]

class PatientInput(BaseModel):
    age: float = Field(..., ge=0, le=120)
    gender: Literal[0, 1]
    bmi: float = Field(..., ge=0, le=100)
    weight_kg: float = Field(..., ge=0, le=500)
    waist_cm: float = Field(..., ge=0, le=300)
    education: Literal[0, 1, 2]
    alcohol: Literal[0, 1]
    t2d: Literal[0, 1]
    sleep_apnea_syndrome: Literal[0, 1]
    gastroesophageal_reflux_disease: Literal[0, 1]
    ede_q_per_operation: float = Field(..., ge=0, le=10)

@app.get("/")
def root():
    return {"message": "Binge Eating Predictor API is running"}

@app.post("/predict")
def predict(input_data: PatientInput):
    row = pd.DataFrame(
        [[
            input_data.age,
            input_data.gender,
            input_data.bmi,
            input_data.weight_kg,
            input_data.waist_cm,
            input_data.education,
            input_data.alcohol,
            input_data.t2d,
            input_data.sleep_apnea_syndrome,
            input_data.gastroesophageal_reflux_disease,
            input_data.ede_q_per_operation,
        ]],
        columns=FEATURE_COLUMNS,
    )

    prediction = int(model.predict(row)[0])
    probability = float(model.predict_proba(row)[0][1])

    return {
        "prediction": prediction,
        "probability": probability,
    }