from fastapi import FastAPI
from pydantic import BaseModel
import traceback

from risk_engine import predict_risk
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


class Patient(BaseModel):
    Age: int
    Gender: str
    Symptoms: str
    Blood_Pressure: int
    Heart_Rate: int
    Temperature: float
    SpO2: int
    BMI: float
    Allergies: str
    Current_Medication: str
    Pre_Existing_Conditions: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict(patient: Patient):
    try:
        data = patient.dict()
        result = predict_risk(data)
        return result

    except Exception as e:
        return {
            "error": str(e),
            "trace": traceback.format_exc()
        }
