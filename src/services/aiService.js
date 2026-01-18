import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI
// "dangerouslyAllowBrowser: true" is required because we are running this 
// directly in React (Frontend) instead of a Backend server.
const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true 
});

const SYSTEM_INSTRUCTION = `
You are Eco-AI, the official assistant for KanemWaste.

**YOUR GOAL:**
Help users recycle and use KanemWaste services.

**BUTTON PROTOCOL (CRITICAL):**
When a user wants to perform an action, you MUST provide a button using this EXACT markdown format (notice the hash #):
"[BUTTON: Button Text](#action:action_code)"

**SCENARIOS:**
1. **User wants to Book a Pickup:**
   - Response: "You can schedule a waste pickup easily on our booking page."
   - REQUIRED BUTTON: [BUTTON: Book a Pickup Now](#action:book-pickup)

2. **User wants to Scan Waste (Snap-Sort):**
   - Response: "I can open the AI Scanner for you right now."
   - REQUIRED BUTTON: [BUTTON: Open AI Scanner](#action:open-scanner)

3. **User asks "About Us":**
   - Response: "KanemWaste is dedicated to a cleaner future by empowering communities through smart recycling."
   - REQUIRED BUTTON: [BUTTON: Read Our Full Story](#action:about-us)

4. **Contact / Socials:**
   - WhatsApp: **[Chat on WhatsApp](https://wa.me/234000000000)**
   - Instagram: **[Follow on Instagram](https://instagram.com)**

**GUARDRAILS:**
- ONLY answer questions about Waste, Recycling, and KanemWaste.
- If asked about other topics, politely refuse.
`;

// Helper: Convert Image URL to Base64 (OpenAI needs the raw image data string)
const imageUrlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); 
    reader.readAsDataURL(blob);
  });
};

export const identifyWaste = async (imageUrl) => {
  try {
    const base64Image = await imageUrlToBase64(imageUrl);
    
    console.log("🤖 Asking OpenAI (gpt-4o-mini) to analyze image...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective vision model
      messages: [
        {
          role: "system",
          content: `${SYSTEM_INSTRUCTION} \n\n TASK: Analyze this waste. Return ONLY valid JSON.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this item. Return JSON: { \"itemName\": \"...\", \"isRecyclable\": true/false, \"confidence\": 0-100, \"reasoning\": \"...\", \"handlingTips\": [\"...\"] }" },
            { type: "image_url", image_url: { url: base64Image } }
          ]
        }
      ],
      response_format: { type: "json_object" } // Forces OpenAI to give perfect JSON
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);

  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Could not analyze image. Please check your internet or API key.");
  }
};

export const chatAboutWaste = async (message, context) => {
  try {
    const contextString = context.itemName 
        ? `User is currently looking at: ${context.itemName}.` 
        : "General recycling question.";

    console.log("🤖 Chatting with OpenAI (gpt-4o-mini)...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "system", content: `CONTEXT: ${contextString}` },
        { role: "user", content: message }
      ]
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    return "I'm having trouble connecting to the server. Please check your internet connection.";
  }
};