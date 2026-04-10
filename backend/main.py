from typing import Literal
import os

import joblib
import pandas as pd
from database import Base, engine, SessionLocal
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import Base, engine, SessionLocal
from models import BingePrediction
import csv
import io
from fastapi.responses import StreamingResponse

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

Base.metadata.create_all(bind=engine)

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

    db = SessionLocal()
    try:
        new_record = BingePrediction(
            age=input_data.age,
            gender=input_data.gender,
            bmi=input_data.bmi,
            weight_kg=input_data.weight_kg,
            waist_cm=input_data.waist_cm,
            education=input_data.education,
            alcohol=input_data.alcohol,
            t2d=input_data.t2d,
            sleep_apnea_syndrome=input_data.sleep_apnea_syndrome,
            gastroesophageal_reflux_disease=input_data.gastroesophageal_reflux_disease,
            ede_q_per_operation=input_data.ede_q_per_operation,
            prediction=prediction,
            probability=probability,
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
    finally:
        db.close()

    return {
        "prediction": prediction,
        "probability": probability,
        "saved": True,
    }

@app.get("/records")
def get_records():
    db = SessionLocal()
    try:
        rows = db.query(BingePrediction).order_by(BingePrediction.created_at.desc()).all()

        return [
            {
                "id": row.id,
                "age": row.age,
                "gender": row.gender,
                "bmi": row.bmi,
                "weight_kg": row.weight_kg,
                "waist_cm": row.waist_cm,
                "education": row.education,
                "alcohol": row.alcohol,
                "t2d": row.t2d,
                "sleep_apnea_syndrome": row.sleep_apnea_syndrome,
                "gastroesophageal_reflux_disease": row.gastroesophageal_reflux_disease,
                "ede_q_per_operation": row.ede_q_per_operation,
                "prediction": row.prediction,
                "probability": row.probability,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ]
    finally:
        db.close()


@app.get("/download-records")
def download_records():
    db = SessionLocal()
    try:
        rows = db.query(BingePrediction).order_by(BingePrediction.created_at.desc()).all()

        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            "ID",
            "Age",
            "Gender",
            "BMI",
            "Weight (kg)",
            "Waist (cm)",
            "Education",
            "Alcohol",
            "T2D",
            "Sleep Apnea Syndrome",
            "Gastroesophageal Reflux Disease",
            "EDE-Q Score (Per-operation)",
            "Prediction",
            "Probability",
            "Created At"
        ])

        for row in rows:
            writer.writerow([
                row.id,
                row.age,
                row.gender,
                row.bmi,
                row.weight_kg,
                row.waist_cm,
                row.education,
                row.alcohol,
                row.t2d,
                row.sleep_apnea_syndrome,
                row.gastroesophageal_reflux_disease,
                row.ede_q_per_operation,
                row.prediction,
                row.probability,
                row.created_at
            ])

        output.seek(0)

        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=binge_records.csv"}
        )
    finally:
        db.close()