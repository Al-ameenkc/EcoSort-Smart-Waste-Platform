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