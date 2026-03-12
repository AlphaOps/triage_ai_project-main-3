import pandas as pd
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
df = pd.read_csv("synthetic_patients_refined.csv")

# Columns to encode
cat_cols = [
    "Gender",
    "Symptoms",
    "Allergies",
    "Current_Medication",
    "Pre_Existing_Conditions",
    "Risk_Level"
]

encoders = {}

for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

print("✅ Encoding done")

# Save processed dataset
df.to_csv("processed_data.csv", index=False)

# Save encoders for later website use
joblib.dump(encoders, "encoders.pkl")

print("✅ Processed data saved")
print("✅ Encoders saved")
