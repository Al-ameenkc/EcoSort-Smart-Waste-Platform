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

// Helper: Convert Image to Base64 (Keep this)
const imageUrlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); 
    reader.readAsDataURL(blob);
  });
};

// --- NEW FUNCTION: Call Vercel API ---
async function callMySecureAPI(messages, jsonMode = false) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: messages,
                response_format: jsonMode ? { type: "json_object" } : undefined
            })
        });

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("API Error:", error);
        throw new Error("Failed to connect to AI server.");
    }
}

export const identifyWaste = async (imageUrl) => {
  try {
    const base64Image = await imageUrlToBase64(imageUrl);
    
    // Construct the message payload
    const messages = [
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
    ];

    const content = await callMySecureAPI(messages, true); // true = expect JSON
    return JSON.parse(content);

  } catch (error) {
    console.error("Identify Error:", error);
    throw new Error("Could not analyze image.");
  }
};

export const chatAboutWaste = async (message, context) => {
  try {
    const contextString = context.itemName 
        ? `User is currently looking at: ${context.itemName}.` 
        : "General recycling question.";

    const messages = [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "system", content: `CONTEXT: ${contextString}` },
        { role: "user", content: message }
    ];

    return await callMySecureAPI(messages, false);

  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to the server.";
  }
};