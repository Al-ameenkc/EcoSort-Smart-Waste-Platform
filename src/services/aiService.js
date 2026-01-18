import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// NEW STRATEGY: Use the most stable, widely available models.
// We removed the "2.0" and "Flash" models that were giving you errors.
const MODEL_CANDIDATES = [
  "gemini-pro",                 // The classic, most reliable model (v1.0)
  "gemini-1.5-flash-latest",    // Try the "Latest" alias (sometimes works when specific versions fail)
  "gemini-1.0-pro"              // Specific version of the classic model
];

const SYSTEM_INSTRUCTION = `
You are Eco-AI, the official assistant for KanemWaste.

**YOUR GOAL:**
Help users recycle and use KanemWaste services.

**BUTTON PROTOCOL (CRITICAL):**
When a user wants to perform an action, you MUST provide a button using this EXACT markdown format:
"[BUTTON: Button Text](action:action_code)"

**SCENARIOS:**
1. **User wants to Book a Pickup:**
   - Response: "You can schedule a waste pickup easily on our booking page."
   - REQUIRED BUTTON: [BUTTON: Book a Pickup Now](action:book-pickup)

2. **User wants to Scan Waste (Snap-Sort):**
   - Response: "I can open the AI Scanner for you right now."
   - REQUIRED BUTTON: [BUTTON: Open AI Scanner](action:open-scanner)

3. **User asks "About Us":**
   - Response: "KanemWaste is dedicated to a cleaner future by empowering communities through smart recycling."
   - REQUIRED BUTTON: [BUTTON: Read Our Full Story](action:about-us)

4. **Contact / Socials:**
   - WhatsApp: **[Chat on WhatsApp](https://wa.me/234000000000)**
   - Instagram: **[Follow on Instagram](https://instagram.com)**

**GUARDRAILS:**
- ONLY answer questions about Waste, Recycling, and KanemWaste.
- If asked about other topics, politely refuse.
`;

const fileToGenerativePart = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1];
      resolve({ inlineData: { data: base64data, mimeType: blob.type } });
    };
    reader.readAsDataURL(blob);
  });
};

export const identifyWaste = async (imageUrl) => {
  const imagePart = await fileToGenerativePart(imageUrl);
  const prompt = `${SYSTEM_INSTRUCTION} \n Analyze this waste. JSON format only.`;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      console.log(`🤖 Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Note: gemini-pro (v1.0) sometimes doesn't support system instructions in the same way,
      // so we include the instruction in the prompt itself to be safe.
      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text();
      
      let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      
      return JSON.parse(cleanText);
    } catch (error) { 
        console.warn(`❌ ${modelName} Failed:`, error.message);
    }
  }
  throw new Error("Could not identify image. Please try again later.");
};

export const chatAboutWaste = async (message, context) => {
    const contextString = context.itemName 
        ? `User is asking about: ${context.itemName}.` 
        : "General recycling question.";

    const finalPrompt = `
      ${SYSTEM_INSTRUCTION}
      CONTEXT: ${contextString}
      QUESTION: "${message}"
      Answer briefly. Use the BUTTON PROTOCOL if the user needs to navigate.
    `;

    for (const modelName of MODEL_CANDIDATES) {
        try {
            console.log(`🤖 Chatting with model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(finalPrompt);
            return result.response.text();
        } catch (error) { 
            console.warn(`❌ ${modelName} Failed:`, error.message);
            continue; 
        }
    }
    return "I'm having trouble connecting right now. Please check your internet connection.";
};