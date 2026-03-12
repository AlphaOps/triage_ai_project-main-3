
import requests
import json

payload = {
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

try:
    print("Sending request to http://127.0.0.1:8002/predict...")
    response = requests.post("http://127.0.0.1:8002/predict", json=payload)
    print("Status Code:", response.status_code)
    print("Response:", response.text)
    if response.status_code == 200:
        print("Integration Test PASSED")
    else:
        print("Integration Test FAILED")
except Exception as e:
    print("Request failed:", e)
