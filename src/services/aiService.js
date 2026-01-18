import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// The "Safe List" - Tries the newest lite model, then falls back to standard
const MODEL_CANDIDATES = [
  "gemini-2.5-flash-lite", // Fast & Good
  "gemini-1.5-flash",      // Standard & Reliable
  "gemini-2.0-flash-exp"   // Backup
];

const fileToGenerativePart = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64data,
          mimeType: blob.type,
        },
      });
    };
    reader.readAsDataURL(blob);
  });
};

export const identifyWaste = async (imageUrl) => {
  const imagePart = await fileToGenerativePart(imageUrl);
  
  const prompt = `
    Analyze this image of waste. Return ONLY a JSON object:
    { "itemName": "Item", "isRecyclable": true, "confidence": 100, "reasoning": "...", "handlingTips": [] }
  `;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      console.log(`🤖 Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ Success with ${modelName}!`);
      
      let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      
      return JSON.parse(cleanText);

    } catch (error) {
      console.warn(`❌ ${modelName} failed:`, error.message);
      // Wait 1s before next try to be safe
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  throw new Error("Could not identify image. Please try again.");
};

export const chatAboutWaste = async (message, context) => {
    for (const modelName of MODEL_CANDIDATES) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(`Context: ${context.itemName}. Question: ${message}`);
            return result.response.text();
        } catch (e) { continue; }
    }
    return "I'm having trouble connecting right now.";
};