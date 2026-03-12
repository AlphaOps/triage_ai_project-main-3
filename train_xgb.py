import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.utils.class_weight import compute_sample_weight
from xgboost import XGBClassifier
import joblib


# Load processed dataset
df = pd.read_csv("processed_data_v2.csv")
# remove rule-derived flag features (prevent leakage)
leak_cols = [
    "low_spo2",
    "high_bp",
    "high_hr",
    "fever",
    "obese",
    "elderly"
]

df = df.drop(columns=leak_cols)


# Drop ID column
df = df.drop(columns=["Patient_ID"])

# Split X and y
X = df.drop("Risk_Level", axis=1)
print("Features used for training:")
print(list(X.columns))

y = df["Risk_Level"]

# Train test split
X_train, X_test, y_train, y_test = train_test_split(

    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
# ---- add small label noise to avoid over-perfect fit ----
import numpy as np

noise_rate = 0.05
n_noise = int(len(y_train) * noise_rate)

noise_idx = np.random.choice(len(y_train), n_noise, replace=False)
unique_classes = y_train.unique()

for i in noise_idx:
    y_train.iloc[i] = np.random.choice(unique_classes)
# --------------------------------------------------------



print("Train size:", len(X_train))
print("Test size:", len(X_test))


sample_weights = compute_sample_weight(
    class_weight="balanced",
    y=y_train
)

# Build XGBoost model
model = XGBClassifier(
    n_estimators=600,
    max_depth=8,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.9,
    min_child_weight=1,
    gamma=0.1,
    objective="multi:softprob",
    eval_metric="mlogloss"
)


# Train
model.fit(X_train, y_train, sample_weight=sample_weights)

# Predict
preds = model.predict(X_test)

# Metrics
print("\nAccuracy:", accuracy_score(y_test, preds))
print("\nReport:\n", classification_report(y_test, preds))

# Save model
joblib.dump(model, "xgb_risk_model.pkl")

print("\n✅ XGBoost model saved")
