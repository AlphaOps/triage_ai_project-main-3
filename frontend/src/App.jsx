import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage/LandingPage'
import PatientLogin from './pages/PatientLogin/PatientLogin'
import PatientSignup from './pages/PatientSignup/PatientSignup'
import StaffLogin from './pages/StaffLogin/StaffLogin'
import PatientDashboard from './pages/PatientDashboard/PatientDashboard'
import Assessment from './pages/Assessment/Assessment'
import AnalysisLoading from './pages/AnalysisLoading/AnalysisLoading'
import RiskResult from './pages/RiskResult/RiskResult'
import AIChat from './pages/AIChat/AIChat'
import HospitalDashboard from './pages/HospitalDashboard/HospitalDashboard'
import DoctorSearch from './pages/DoctorSearch/DoctorSearch'
import PrescriptionUpload from './pages/PrescriptionUpload/PrescriptionUpload'
import HealthTimeline from './pages/HealthTimeline/HealthTimeline'
import VoiceAgent from './pages/VoiceAgent/VoiceAgent'
import AINurseFab from './components/AINurseFab/AINurseFab'
import { predictRisk } from './utils/api'

/* ─── Triage Engine (Simulated) ─── */
function triageEngine(data) {
    const s = (data.symptoms || []).map(x => x.toLowerCase())
    const h = (data.history || []).map(x => x.toLowerCase())
    const hr = parseInt(data.heartRate) || 72
    const bp = data.bp || '120/80'
    const bpSys = parseInt(bp.split('/')[0]) || 120
    const temp = parseFloat(data.temperature) || 98.6
    const age = parseInt(data.age) || 30

    let score = 0
    const factors = []

    // Symptom scoring
    if (s.includes('chest pain')) { score += 40; factors.push('Chest Pain – cardinal cardiac symptom') }
    if (s.includes('shortness of breath')) { score += 25; factors.push('Dyspnea – respiratory/cardiac concern') }
    if (s.includes('palpitations')) { score += 20; factors.push('Palpitations – arrhythmia indicator') }
    if (s.includes('abdominal pain')) { score += 15; factors.push('Abdominal pain – surgical/GI concern') }
    if (s.includes('blurred vision')) { score += 15; factors.push('Visual disturbance – neuro concern') }
    if (s.includes('numbness')) { score += 12; factors.push('Numbness – neurological indicator') }
    if (s.includes('dizziness')) { score += 12; factors.push('Dizziness – multi-system indicator') }
    if (s.includes('fever')) { score += 10; factors.push('Fever – infectious/inflammatory') }
    if (s.includes('severe headache') || s.includes('headache')) { score += 10; factors.push('Headache – requires evaluation') }
    if (s.includes('nausea')) { score += 5; factors.push('Nausea') }
    if (s.includes('fatigue')) { score += 3; factors.push('Fatigue') }
    if (s.includes('cough')) { score += 3; factors.push('Cough') }
    if (s.includes('back pain')) { score += 5; factors.push('Back pain') }
    if (s.includes('swelling')) { score += 8; factors.push('Swelling') }
    if (s.includes('joint pain')) { score += 5; factors.push('Joint pain') }
    if (s.includes('rash')) { score += 3; factors.push('Rash') }
    if (s.includes('sore throat')) { score += 2; factors.push('Sore throat') }
    if (s.includes('anxiety')) { score += 4; factors.push('Anxiety') }
    if (s.includes('insomnia')) { score += 2; factors.push('Insomnia') }
    if (s.includes('loss of appetite')) { score += 3; factors.push('Loss of appetite') }

    // Vital scoring
    if (hr > 100) { score += 15; factors.push(`Tachycardia (${hr} bpm)`) }
    else if (hr > 90) { score += 5; factors.push(`Elevated HR (${hr} bpm)`) }
    if (bpSys > 140) { score += 12; factors.push(`Hypertensive (${bp})`) }
    else if (bpSys > 130) { score += 5; factors.push(`Elevated BP (${bp})`) }
    if (temp > 101) { score += 10; factors.push(`High fever (${temp}°F)`) }
    else if (temp > 99.5) { score += 4; factors.push(`Low-grade fever (${temp}°F)`) }

    // History scoring
    if (h.includes('heart disease')) { score += 15; factors.push('History: Heart disease') }
    if (h.includes('hypertension')) { score += 10; factors.push('History: Hypertension') }
    if (h.includes('diabetes')) { score += 8; factors.push('History: Diabetes') }
    if (h.includes('asthma')) { score += 5; factors.push('History: Asthma') }

    // Age factor
    if (age > 65) { score += 10; factors.push(`Age factor (${age})`) }
    else if (age > 50) { score += 5; factors.push(`Age factor (${age})`) }
    else if (age < 12) { score += 5; factors.push(`Pediatric patient (${age})`) }

    // Determine priority
    let risk, dept, action, explanation
    const confidence = Math.min(96, Math.max(62, 70 + Math.floor(score / 5)))

    if (score >= 40) {
        risk = 'HIGH'
        if (s.includes('chest pain') || s.includes('palpitations')) {
            dept = 'Cardiology — Emergency'
            action = 'Immediate ECG and cardiac enzyme panel recommended. Priority queue assignment.'
            explanation = `This assessment indicates a high-urgency case. The combination of ${factors.slice(0, 3).map(f => f.split('–')[0].trim()).join(', ')} suggests potential cardiovascular concern requiring immediate clinical evaluation.`
        } else if (s.includes('abdominal pain')) {
            dept = 'Emergency — General Surgery'
            action = 'Emergency surgical consultation and imaging recommended.'
            explanation = `Acute abdominal presentation with ${factors.slice(0, 3).map(f => f.split('–')[0].trim()).join(', ')} warrants urgent surgical assessment.`
        } else {
            dept = 'Emergency Medicine'
            action = 'Immediate clinical evaluation required. Priority triage assignment.'
            explanation = `Multiple high-urgency indicators detected: ${factors.slice(0, 3).map(f => f.split('–')[0].trim()).join(', ')}. Immediate clinical review recommended.`
        }
    } else if (score >= 20) {
        risk = 'MEDIUM'
        if (s.includes('headache') || s.includes('blurred vision') || s.includes('numbness')) {
            dept = 'Neurology'
            action = 'CT scan recommended within 2 hours. Neurological consultation.'
            explanation = `Neurological symptoms including ${factors.slice(0, 3).map(f => f.split('–')[0].trim()).join(', ')} suggest further investigation is warranted within a reasonable timeframe.`
        } else if (s.includes('back pain') || s.includes('joint pain')) {
            dept = 'Orthopedics'
            action = 'X-ray imaging and specialist referral within 24 hours.'
            explanation = `Musculoskeletal presentation with ${factors.slice(0, 3).map(f => f.split('–')[0].trim()).join(', ')} requires clinical evaluation but is not immediately life-threatening.`
        } else if (s.includes('fever')) {
            dept = 'Internal Medicine'
            action = 'Blood work and monitoring. Antipyretics as needed.'
            explanation = `Febrile presentation with ${factors.slice(0, 3).map(f => f.split('–')[0].trim()).join(', ')} requires diagnostic workup within 4–6 hours.`
        } else {
            dept = 'General Medicine'
            action = 'Clinical assessment within 4 hours. Diagnostic workup recommended.'
            explanation = `Combined presentation of ${factors.slice(0, 3).map(f => f.split('–')[0].trim()).join(', ')} indicates medium urgency requiring timely evaluation.`
        }
    } else {
        risk = 'LOW'
        if (s.includes('rash') || s.includes('swelling')) {
            dept = 'Dermatology'
            action = 'Outpatient follow-up within 1 week. Symptomatic management.'
            explanation = `Mild dermatological presentation. ${factors.slice(0, 2).map(f => f.split('–')[0].trim()).join(', ')} does not indicate an urgent condition.`
        } else if (s.includes('anxiety') || s.includes('insomnia')) {
            dept = 'Psychiatry'
            action = 'Outpatient consultation recommended. Lifestyle guidance.'
            explanation = `Mental health presentation with ${factors.slice(0, 2).map(f => f.split('–')[0].trim()).join(', ')}. Non-urgent but follow-up recommended.`
        } else {
            dept = 'General Medicine'
            action = 'Over-the-counter management. Follow up if symptoms persist beyond 72 hours.'
            explanation = `Mild presentation with ${factors.slice(0, 2).map(f => f.split('–')[0].trim()).join(', ')}. No urgent indicators detected. Monitor and follow up as needed.`
        }
    }

    return {
        risk, dept, action, explanation, confidence, factors,
        vitals: {
            hr: data.heartRate ? `${data.heartRate} bpm` : '72 bpm',
            bp: data.bp || '120/80',
            temp: data.temperature ? `${data.temperature}°F` : '98.6°F'
        },
        symptoms: data.symptoms || [],
        age: data.age || '—',
        gender: data.gender || '—'
    }
}

/* ─── Page Transition Wrapper ─── */
function PageTransition({ children, pageKey }) {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        setVisible(false)
        const t = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(t)
    }, [pageKey])
    return (
        <div className={`page-transition ${visible ? 'page-visible' : ''}`} key={pageKey}>
            {children}
        </div>
    )
}

/* ─── Application ─── */
function App() {
    const [page, setPage] = useState('landing')
    const [showChat, setShowChat] = useState(false)
    const [assessmentResult, setAssessmentResult] = useState(null)
    const [assessmentData, setAssessmentData] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [voiceMode, setVoiceMode] = useState('general')

    const go = (p, vMode = 'general') => {
        window.scrollTo(0, 0)
        if (vMode) setVoiceMode(vMode)
        setPage(p)
    }

    const handleAssessmentComplete = async (data) => {
        setAssessmentData(data)
        setAssessmentResult(null)
        setIsAnalyzing(true)
        go('analysisLoading')

        // Prepare ML Payload
        const bpParts = (data.bp || "120/80").split('/')
        const payload = {
            Age: Number(data.age) || 30,
            Gender: data.gender || "Male",
            Symptoms: (data.symptoms || []).join(", "),
            Blood_Pressure: Number(bpParts[0]) || 120,
            Heart_Rate: Number(data.heartRate) || 72,
            Temperature: Number(data.temperature) || 98.6,
            SpO2: Number(data.spo2) || 98,
            BMI: Number(data.bmi) || 25.0,
            Allergies: data.allergies || "None",
            Current_Medication: data.medications || "None",
            Pre_Existing_Conditions: (data.history || []).join(", ") || "None"
        }

        // Call ML Backend
        const mlResult = await predictRisk(payload)

        let result
        if (mlResult) {
            // Map ML response to existing UI format
            // Backend returns: "Low", "Medium", "High" -> frontend needs "LOW", "MEDIUM", "HIGH"
            result = {
                risk: (mlResult.final_risk || 'LOW').toUpperCase(),
                confidence: Math.round((mlResult.ml_confidence || 0) * 100),
                dept: mlResult.department || 'General Medicine',
                action: 'Further clinical evaluation recommended.',
                explanation: mlResult.explanation_summary || 'No specific explanation provided.',
                factors: triageEngine(data).factors,
                vitals: {
                    hr: data.heartRate ? `${data.heartRate} bpm` : '72 bpm',
                    bp: data.bp || '120/80',
                    temp: data.temperature ? `${data.temperature}°F` : '98.6°F'
                },
                symptoms: data.symptoms || [],
                age: data.age || '—',
                gender: data.gender || '—'
            }
        } else {
            // Fallback
            result = triageEngine(data)
        }

        setAssessmentResult(result)
        setIsAnalyzing(false)
    }

    return (
        <>
            <PageTransition pageKey={page}>
                {page === 'landing' && (
                    <LandingPage
                        onPatientLogin={() => go('patientLogin')}
                        onStaffLogin={() => go('staffLogin')}
                    />
                )}
                {page === 'patientLogin' && (
                    <PatientLogin
                        onLogin={() => go('patientDashboard')}
                        onSignupLink={() => go('patientSignup')}
                        onBack={() => go('landing')}
                    />
                )}
                {page === 'patientSignup' && (
                    <PatientSignup
                        onSignup={(data) => { console.log('Signed up:', data); go('patientDashboard'); }}
                        onLoginLink={() => go('patientLogin')}
                        onBack={() => go('landing')}
                    />
                )}
                {page === 'staffLogin' && (
                    <StaffLogin
                        onLogin={() => go('hospitalDashboard')}
                        onBack={() => go('landing')}
                    />
                )}
                {page === 'patientDashboard' && (
                    <PatientDashboard
                        onStartAssessment={() => go('assessment')}
                        onOpenChat={() => go('voiceAgent', 'general')}
                        onDoctorSearch={() => go('doctorSearch')}
                        onPrescription={() => go('prescription')}
                        onTimeline={() => go('timeline')}
                        onVoiceAgent={() => go('voiceAgent', 'assessment')}
                        onLogout={() => go('landing')}
                    />
                )}
                {page === 'assessment' && (
                    <Assessment
                        onComplete={handleAssessmentComplete}
                        onBack={() => go('patientDashboard')}
                    />
                )}
                {page === 'analysisLoading' && (
                    <AnalysisLoading
                        isReady={!!assessmentResult}
                        onComplete={() => go('riskResult')}
                    />
                )}
                {page === 'riskResult' && (
                    <RiskResult
                        result={assessmentResult}
                        onBack={() => go('patientDashboard')}
                        onChat={() => go('voiceAgent', 'general')}
                        onDoctorSearch={() => go('doctorSearch')}
                        onNewAssessment={() => go('assessment')}
                    />
                )}
                {page === 'doctorSearch' && (
                    <DoctorSearch onBack={() => go('patientDashboard')} />
                )}
                {page === 'prescription' && (
                    <PrescriptionUpload onBack={() => go('patientDashboard')} />
                )}
                {page === 'timeline' && (
                    <HealthTimeline onBack={() => go('patientDashboard')} />
                )}

                {page === 'hospitalDashboard' && (
                    <HospitalDashboard onLogout={() => go('landing')} />
                )}
            </PageTransition>
            {page === 'voiceAgent' && <VoiceAgent mode={voiceMode} onBack={() => go('patientDashboard')} />}
            {showChat && <AIChat onClose={() => setShowChat(false)} />}

            {/* Global AI Nurse FAB for Patient Pages */}
            {['patientDashboard', 'assessment', 'riskResult', 'doctorSearch', 'prescription', 'timeline'].includes(page) && (
                <AINurseFab onClick={() => go('voiceAgent', 'general')} />
            )}
        </>
    )
}

export default App
