def recommend_department(patient):

    s = str(patient["Symptoms"]).lower()
    cond = str(patient.get("Pre_Existing_Conditions", "")).lower()

    bp = patient["Blood_Pressure"]
    hr = patient["Heart_Rate"]
    spo2 = patient["SpO2"]
    temp = patient["Temperature"]

    # ---------------- Emergency first ----------------
    if spo2 < 88 or hr >= 130 or bp >= 180:
        return "Emergency"

    scores = {
        "Cardiology": 0,
        "Neurology": 0,
        "Pulmonology": 0,
        "Gastroenterology": 0,
        "Nephrology": 0,
        "Endocrinology": 0,
        "Rheumatology": 0,
        "Oncology": 0,
        "Infectious Disease": 0,
        "Dermatology": 0,
        "Hematology": 0,
        "General Medicine": 2   # safe fallback bias
    }

    # ---------------- Vital-based signals ----------------

    if spo2 < 92:
        scores["Pulmonology"] += 3

    if bp > 160 or hr > 115:
        scores["Cardiology"] += 3

    if temp >= 101:
        scores["Infectious Disease"] += 2

    # ---------------- System keyword stems ----------------

    system_patterns = {
        "Cardiology": ["chest", "card", "heart", "palpit"],
        "Neurology": ["head", "neuro", "dizzi", "confus", "seiz", "stroke"],
        "Pulmonology": ["breath", "lung", "cough", "asthma", "resp"],
        "Gastroenterology": ["abdom", "stomach", "liver", "gut", "vomit", "diarr"],
        "Nephrology": ["kidney", "renal", "urine"],
        "Endocrinology": ["thyroid", "diabet", "hormon"],
        "Rheumatology": ["joint", "arth", "autoimm"],
        "Oncology": ["tumor", "cancer", "mass"],
        "Dermatology": ["skin", "rash", "lesion"],
        "Hematology": ["blood", "anemia", "clot"],
        "Infectious Disease": ["infect", "viral", "bacter"]
    }

    for dept, stems in system_patterns.items():
        if any(stem in s for stem in stems):
            scores[dept] += 3

    # ---------------- Condition-based routing ----------------

    if "diabet" in cond or "thyroid" in cond:
        scores["Endocrinology"] += 3

    if "asthma" in cond:
        scores["Pulmonology"] += 3

    if "arthritis" in cond:
        scores["Rheumatology"] += 3

    if "heart" in cond:
        scores["Cardiology"] += 3

    if "kidney" in cond:
        scores["Nephrology"] += 3

    # ---------------- Choose best ----------------

    best_dept = max(scores, key=scores.get)

    return best_dept
