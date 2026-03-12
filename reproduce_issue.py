import sys
import traceback
from risk_engine import predict_risk

# Sample data matching PatientInput schema in api.py
sample_patient = {
    "Age": 45,
    "Gender": "Male",
    "Symptoms": "chest pain, shortness of breath",
    "Blood_Pressure": 140,
    "Heart_Rate": 100,
    "Temperature": 98.6,
    "SpO2": 95,
    "BMI": 28.5,
    "Allergies": "None",
    "Current_Medication": "None",
    "Pre_Existing_Conditions": "Hypertension"
}


print("Attempting to run predict_risk...")
try:
    result = predict_risk(sample_patient)
    print("Success!")
    print(result)
except Exception:
    with open("error_trace.txt", "w", encoding="utf-8") as f:
        traceback.print_exc(file=f)
    print("Traceback written to error_trace.txt")
