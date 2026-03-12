import joblib
import pandas as pd

from rule_engine import rule_risk_score
from department_engine import recommend_department


# -----------------------------
# Load trained artifacts
# -----------------------------
model = joblib.load("xgb_risk_model.pkl")
encoders = joblib.load("encoders.pkl")

feature_names = model.get_booster().feature_names
feature_importance = model.feature_importances_



# -----------------------------
# Preprocess input using encoders
# -----------------------------
# -----------------------------
# Preprocess input using encoders
# -----------------------------
def preprocess_input(patient_dict):

    df = pd.DataFrame([patient_dict])

    # encode categorical safely
    for col, enc in encoders.items():

        if col in df.columns and col != "Risk_Level":

            def safe_encode(val):
                if val in enc.classes_:
                    return enc.transform([val])[0]
                else:
                    return -1   # unseen label bucket

            df[col] = df[col].apply(safe_encode)

    # FORCE column order to match training
    df = df[model.get_booster().feature_names]

    return df

def get_top_ml_factors(n=5):
    pairs = list(zip(feature_names, feature_importance))
    pairs.sort(key=lambda x: x[1], reverse=True)

    # convert numpy → python float for JSON safety
    safe = [(str(name), float(score)) for name, score in pairs[:n]]
    return safe


# -----------------------------
# Hybrid Risk Prediction Engine
# -----------------------------
def predict_risk(patient_dict):

    # ---------- ML prediction ----------
    df = preprocess_input(patient_dict)



    probs = model.predict_proba(df)[0]
    ml_pred = model.predict(df)[0]
    ml_conf = float(max(probs))

    risk_map = {
        0: "Low",
        1: "Medium",
        2: "High"
    }

    ml_risk = risk_map.get(int(ml_pred), "Medium")

    # ---------- Rule engine ----------
    rule_risk, rule_score, rule_reasons = rule_risk_score(patient_dict)

    # ---------- Hybrid fusion (clinically balanced) ----------
    order = {"Low": 1, "Medium": 2, "High": 3}

    if rule_risk == "High":
        final_risk = "High"
        source = "rule_override_high"

    elif rule_risk == "Low" and ml_risk == "Medium":
        final_risk = "Low"
        source = "rule_downgrade"

    elif ml_risk == "High" and rule_risk == "Low":
        final_risk = "Medium"
        source = "ml_softened_by_rules"

    elif rule_risk == "Medium" and ml_risk == "High":
        final_risk = "High"
        source = "combined_escalation"

    else:
        final_risk = ml_risk
        source = "ml_primary"

    # ---------- Department routing ----------
    department = recommend_department(patient_dict)

    top_factors = get_top_ml_factors()

    explanation_summary = (
    ", ".join(rule_reasons)
    if rule_reasons
    else "no abnormal clinical thresholds triggered"
    )



   

    # ---------- Final output ----------
    return {
        "final_risk": final_risk,
        "ml_risk": ml_risk,
        "ml_confidence": ml_conf,
        "rule_risk": rule_risk,
        "rule_score": rule_score,
        "rule_reasons": rule_reasons,
        "decision_source": source,
        "department": department,
        "ml_top_features": top_factors,
        "explanation_summary": explanation_summary

    }
