🧠 Binge Eating Risk Prediction
This project is an end-to-end machine learning application that predicts the risk of binge eating behavior based on patient health and lifestyle data.

🚀 Project Overview
The goal of this project is to build a supervised machine learning model capable of predicting whether a patient is likely to have binge eating behavior.

The system includes:

Data preprocessing and model training
Model evaluation and selection
Backend API using FastAPI
Frontend web interface using React + TypeScript
Real-time prediction system
📊 Dataset
The dataset contains patient-related features such as:

Age
Gender
BMI
Weight
Waist circumference
Education level
Alcohol consumption
Type 2 Diabetes (T2D)
Sleep apnea syndrome
Gastroesophageal reflux disease
EDE-Q score
🤖 Machine Learning
Models Used
Logistic Regression
Random Forest
Final Model
✅ Random Forest (selected due to better performance)
Evaluation Metrics
Accuracy
ROC-AUC Score
Precision / Recall / F1-score
⚠️ Important Note
Some columns were removed to avoid data leakage, ensuring that the model only uses information available before prediction.

🖥️ Backend (FastAPI)
The backend exposes a REST API for prediction.

Run Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload