
import { GoogleGenAI, Type } from "@google/genai";
import { SensorData, LeakReport, RiskLevel } from "../types";

// Always initialize the client with process.env.API_KEY as a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeLeakData(sensorData: SensorData[]): Promise<LeakReport> {
  const dataSummary = sensorData.map(d => 
    `Time: ${d.timestamp}, Flow: ${d.flowRate}L/s, Pressure: ${d.pressure}Bar, Acoustic: ${d.acousticFreq}Hz`
  ).join('\n');

  const prompt = `
    As a specialized Water Infrastructure AI, analyze the following sensor telemetry from a municipal water pipeline system to detect underground leaks. 
    Look for patterns such as:
    1. Pressure drops combined with flow increases (classic leak signature).
    2. Specific acoustic frequency spikes (70Hz - 200Hz often indicates underground pipe noise).
    3. Vibration anomalies.

    Sensor Data History:
    ${dataSummary}

    Output a detailed diagnostic report in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isLeakDetected: { type: Type.BOOLEAN },
            riskLevel: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
            confidence: { type: Type.NUMBER },
            predictedArea: { type: Type.STRING },
            analysisSummary: { type: Type.STRING },
            recommendedAction: { type: Type.STRING }
          },
          required: ["isLeakDetected", "riskLevel", "confidence", "predictedArea", "analysisSummary", "recommendedAction"]
        }
      }
    });

    // Access the .text property directly as it is a getter.
    const result = JSON.parse(response.text);
    return {
      ...result,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to process leak detection data.");
  }
}
