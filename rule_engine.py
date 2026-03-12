def rule_risk_score(patient):
    score = 0
    reasons = []

    spo2 = patient["SpO2"]
    bp = patient["Blood_Pressure"]
    hr = patient["Heart_Rate"]
    temp = patient["Temperature"]
    age = patient["Age"]
    bmi = patient["BMI"]

    # -------- Oxygen saturation --------
    if spo2 < 88:
        score += 5
        reasons.append("Critical low SpO2 (<88)")
    elif spo2 < 92:
        score += 3
        reasons.append("Low SpO2 (<92)")

    # -------- Blood pressure --------
    if bp >= 180:
        score += 4
        reasons.append("Very high BP (>=180)")
    elif bp >= 160:
        score += 2
        reasons.append("High BP (>=160)")

    # -------- Heart rate --------
    if hr >= 130:
        score += 4
        reasons.append("Severe tachycardia (>=130)")
    elif hr >= 110:
        score += 2
        reasons.append("High heart rate (>=110)")

    # -------- Temperature --------
    if temp >= 103:
        score += 3
        reasons.append("High fever (>=103F)")
    elif temp >= 101:
        score += 1
        reasons.append("Fever (>=101F)")

    # -------- Age risk --------
    if age >= 75:
        score += 2
        reasons.append("Advanced age (>=75)")

    # -------- BMI risk --------
    if bmi >= 35:
        score += 1
        reasons.append("Severe obesity (BMI>=35)")

    # -------- Final mapping --------
    if score >= 8:
        risk = "High"
    elif score >= 4:
        risk = "Medium"
    else:
        risk = "Low"

    return risk, score, reasons
