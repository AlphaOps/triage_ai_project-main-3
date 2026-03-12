export const predictRisk = async (payload) => {
    try {
        const response = await fetch("http://127.0.0.1:8002/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Prediction failed");

        return await response.json();
    } catch (error) {
        console.error("ML API Error:", error);
        return null;
    }
};
