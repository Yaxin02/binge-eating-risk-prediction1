# Binge Eating Risk Prediction

This project is a machine learning and scoring-based web application for binge eating risk screening.

This project is related to the main binge eating risk prediction project and is used to calculate the EDE-Q score through a simplified 6-question screening form.

It includes:
- data cleaning and preprocessing
- model training and testing
- final scoring logic
- a simple web interface for prediction and score display

## Project Structure

```bash
.
├── assets/
├── backend/
├── data/
├── docs/
├── frontend/
├── notebooks/
├── .gitignore
├── LICENSE
└── README.md


Predicts binge eating risk
Calculates a simplified EDE-Q style score
Uses a 6-question form
Provides a clear result:
score
risk level
Technologies Used
Python
Flask
Jupyter Notebook
Scikit-learn
Pandas
HTML / CSS
Workflow
Clean the dataset
Explore and test models
Build the final 6-question logic
Connect the logic to the web app
Display the result in a simple interface
Models Tested

The project tested several machine learning models, including:

Logistic Regression
SVM
Random Forest
XGBoost

After comparison, the best setup was selected for the final workflow.

Notes
This project is for academic and demonstration purposes
It is not a medical diagnosis tool
The result should not replace professional clinical evaluation
Author

Yaxin02
