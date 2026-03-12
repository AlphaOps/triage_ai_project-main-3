from risk_engine import predict_risk


patients = [

    # LOW RISK
    {
        "Age": 28, "Gender": "Female", "Symptoms": "cough",
        "Blood_Pressure": 118, "Heart_Rate": 82, "Temperature": 98.7,
        "SpO2": 98, "BMI": 22, "Allergies": "none",
        "Current_Medication": "No",
        "Pre_Existing_Conditions": "none"
    },

    # MEDIUM RISK
    {
        "Age": 55, "Gender": "Male", "Symptoms": "fever",
        "Blood_Pressure": 148, "Heart_Rate": 105, "Temperature": 101.2,
        "SpO2": 93, "BMI": 29, "Allergies": "dust",
        "Current_Medication": "Yes",
        "Pre_Existing_Conditions": "none"
    },

    # HIGH RISK
    {
        "Age": 74, "Gender": "Male", "Symptoms": "chest pain",
        "Blood_Pressure": 172, "Heart_Rate": 122, "Temperature": 102.4,
        "SpO2": 87, "BMI": 33, "Allergies": "none",
        "Current_Medication": "Yes",
        "Pre_Existing_Conditions": "none"
    },

    # EXTRA TEST
    {
        "Age": 30, "Gender": "Male", "Symptoms": "cough",
        "Blood_Pressure": 120, "Heart_Rate": 80, "Temperature": 98.6,
        "SpO2": 98, "BMI": 24, "Allergies": "none",
        "Current_Medication": "No",
        "Pre_Existing_Conditions": "none"
    }

]


for i, p in enumerate(patients, 1):
    print(f"\n====== PATIENT {i} ======")

    result = predict_risk(p)

    for k, v in result.items():
        print(k, ":", v)
