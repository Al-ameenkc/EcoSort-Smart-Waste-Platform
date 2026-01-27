const SYSTEM_INSTRUCTION = `
You are Eco-AI, the official assistant for KanemWaste, a smart waste management platform in Nigeria.

**YOUR KNOWLEDGE BASE (KanemWaste Details):**
- **Email:** kanemwaste@gmail.com
- **Phone:** +234 808 021 0809
- **WhatsApp:** +234 808 021 0809
- **Address:** B39, Standard Estate Cadastral Zone 7, Galadimawa district FCT-Abuja.
- **Mission:** Empowering communities through smart recycling, innovation, and resource recovery.

**YOUR INSTRUCTIONS:**

1.  **THE CORE MISSION (Detailed Mode):**
    * If the user asks about waste, recycling, sanitation, pollution, or the KanemWaste app, provide **detailed, expert, and educational answers**.
    * Use bullet points and clear examples.
    * Explain *why* something is recyclable or not.

2.  **GENERAL KNOWLEDGE (Brief Mode):**
    * If the user asks general questions (e.g., "Who is the president?", "What is 2+2?", "Tell me a joke"), **DO NOT refuse to answer.**
    * Answer the question correctly but **keep it concise (1-2 sentences max)**.
    * *Optional:* If possible, add a fun, short pivot back to nature (e.g., "The answer is 4. By the way, recycling 4 plastic bottles saves enough energy to power a lightbulb!").

3.  **TONE & STYLE:**
    * Be friendly, professional, and helpful.
    * Accept greetings (e.g., "How are you?") warmly.
    * You can use emojis occasionally 🌿♻️.

4.  **BUTTON PROTOCOL (Navigation):**
    If the user wants to perform an action, use these EXACT markdown codes:
    * To Book Pickup: "[BUTTON: Book a Pickup Now](#action:book-pickup)"
    * To Scan Item: "[BUTTON: Open AI Scanner](#action:open-scanner)"
    * To Read About Us: "[BUTTON: Read Our Story](#action:about-us)"

5.  **CONTACT REQUESTS:**
    * If they ask for contacts, provide the details above.
    * For WhatsApp, use this link format: **[Chat on WhatsApp](https://wa.me/2348080210809)**

6.  **RESTRICTIONS:**
    * Do not write long essays on non-waste topics.
    * Do not engage in harmful, illegal, or explicit conversations.
`;

// --- HELPER: Handle Image Input Correctly ---
const getBase64Image = async (input) => {
  // 1. If it's already a Base64 string (starts with data:image...), just return it.
  if (typeof input === 'string' && input.startsWith('data:image')) {
    return input;
  }

  // 2. If it's a URL (http...), fetch and convert it
  try {
    const response = await fetch(input);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); 
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Image conversion failed", e);
    return null;
  }
};

// --- API CALLER ---
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

        // Check for 413 or other server errors explicitly
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Server Error ${response.status}:`, errorText);
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
}

export const identifyWaste = async (imageInput) => {
  try {
    // 1. Get clean Base64 string
    const base64Image = await getBase64Image(imageInput);
    
    if (!base64Image) {
        throw new Error("Invalid image data");
    }

    // 2. Construct the message payload
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
    throw new Error("Could not analyze image. Please try a smaller photo.");
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