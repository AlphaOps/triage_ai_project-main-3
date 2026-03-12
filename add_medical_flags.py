import pandas as pd

df = pd.read_csv("processed_data.csv")

# medical risk flags
df["low_spo2"] = (df["SpO2"] < 92).astype(int)
df["high_bp"] = (df["Blood_Pressure"] > 150).astype(int)
df["high_hr"] = (df["Heart_Rate"] > 110).astype(int)
df["fever"] = (df["Temperature"] > 100.5).astype(int)
df["obese"] = (df["BMI"] > 30).astype(int)
df["elderly"] = (df["Age"] > 65).astype(int)

df.to_csv("processed_data_v2.csv", index=False)

print("✅ Medical flags added")
