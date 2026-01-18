import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// OPTIMIZED LIST: Put the working model FIRST.
const MODEL_CANDIDATES = [
  "gemini-2.5-flash-lite",      // ✅ The Winner (Fastest)
  "gemini-2.0-flash",           // Backup 1
  "gemini-2.0-flash-exp",       // Backup 2
  "gemini-1.5-flash",           // Old Standard (Region locked for you)
  "gemini-pro"                  // Legacy
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

  // Try models in order (Winner is first now!)
  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      // Clean and Parse
      let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      
      return JSON.parse(cleanText);

    } catch (error) {
      // If rate limited, wait a bit and try the NEXT model
      if (error.message.includes("429")) {
          console.warn(`⚠️ ${modelName} busy. Trying next...`);
          await new Promise(r => setTimeout(r, 2000));
          continue;
      }
      console.warn(`❌ ${modelName} failed. Trying next...`);
    }
  }

  throw new Error("Could not identify image. Please try again later.");
};

export const chatAboutWaste = async (message, context) => {
    // Try the list for chat too
    for (const modelName of MODEL_CANDIDATES) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(`Context: ${context.itemName}. Question: ${message}`);
            return result.response.text();
        } catch (e) { continue; }
    }
    return "I'm having trouble connecting right now.";
  };