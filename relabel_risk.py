import pandas as pd

df = pd.read_csv("synthetic_patients.csv")

def compute_risk(row):
    score = 0
    
    if row["SpO2"] < 90:
        score += 4
    if row["Blood_Pressure"] > 160:
        score += 3
    if row["Heart_Rate"] > 115:
        score += 2
    if row["Temperature"] > 101:
        score += 2
    if row["Age"] > 70:
        score += 2
    if row["BMI"] > 32:
        score += 1
    
    if score >= 7:
        return "High"
    elif score >= 4:
        return "Medium"
    else:
        return "Low"

df["Risk_Level"] = df.apply(compute_risk, axis=1)

df.to_csv("synthetic_patients_refined.csv", index=False)

print("✅ Risk labels refined using medical rules")
