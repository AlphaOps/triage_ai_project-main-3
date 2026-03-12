import pandas as pd

df = pd.read_csv("synthetic_patients.csv")

print("\n✅ First 5 rows:")
print(df.head())

print("\n✅ Columns:")
print(df.columns)

print("\n✅ Shape (rows, columns):")
print(df.shape)

print("\n✅ Missing values:")
print(df.isnull().sum())

print("\n✅ Risk level distribution:")
print(df["Risk_Level"].value_counts())

print("\n✅ Numeric summary:")
print(df.describe())
