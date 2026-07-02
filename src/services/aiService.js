const SYSTEM_INSTRUCTION = `
You are Eco-AI, the official assistant for KanemWaste, a smart waste management platform in Nigeria.

**YOUR KNOWLEDGE BASE (KanemWaste Details):**
- **Email:** kanemwaste@gmail.com
- **Phone:** +234 808 021 0809
- **WhatsApp:** +234 808 021 0809
- **Address:** B39, Standard Estate Cadastral Zone 7, Galadimawa district FCT-Abuja.
- **Mission:** Community-powered waste collection and flood prevention in Abuja.
- **Weekly Pickup Fee:** ₦2,000 per week, paid in cash on pickup. This fee sustains fuel and logistics. It is NOT charged for profit.
- **Drop-off:** Customers who bring PET bottles directly to us get paid cash. No weekly fee for drop-offs.
- **Service Areas:** We only operate in listed Abuja areas (Lokogoma, Galadimawa, Apo, Apo Resettlement, Durumi, Gaduwa, Games Village, Lugbe). Each area has a fixed pickup day. If a user's area is not listed, we don't operate there yet.
- **Flood Operations:** Since 2023, we clear blocked drainage before storms, pay cash rewards for verified community hazard tips, and fund this through recycling revenue.

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

const SNAP_SORT_INSTRUCTION = `You are SnapSort, a waste identification assistant for KanemWaste in Abuja, Nigeria.
Analyze the image and return ONLY valid JSON with keys: itemName, isRecyclable (boolean), confidence (0-100), reasoning (string), handlingTips (string array).
Focus on PET bottles, plastics, cartons, and common household waste in Nigeria.`;

let aiRequestInFlight = false;

const formatAiError = (error, productName) => {
  if (error.message?.includes('already in progress')) return error.message;

  const msg = error.message || '';
  if (msg.includes('API key not valid') || msg.includes('API_KEY_INVALID')) {
    return `${productName}: Invalid Gemini API key. Create one at aistudio.google.com/apikey (starts with AIza).`;
  }
  if (msg.includes('limit: 0') || msg.includes('free_tier')) {
    return `${productName}: Your Google project has no free-tier quota on this key. Create a free key at aistudio.google.com/apikey (starts with AIzaSy).`;
  }
  if (msg.includes('not found') || msg.includes('not supported')) {
    return `${productName}: Gemini model unavailable. Restart the dev server after updating GEMINI_MODEL in .env.local.`;
  }
  if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('billing')) {
    return `${productName}: Gemini rate limit reached. Wait a minute and try again.`;
  }
  return msg.length < 220 ? msg : `${productName}: Could not reach the AI service. Check your API key.`;
};

export const isAiRequestInFlight = () => aiRequestInFlight;

const getBase64Image = async (input) => {
  if (typeof input === 'string' && input.startsWith('data:image')) {
    return input;
  }

  try {
    const response = await fetch(input);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error('Image conversion failed', e);
    return null;
  }
};

async function callMySecureAPI(messages, jsonMode = false) {
  if (aiRequestInFlight) {
    throw new Error('An AI request is already in progress. Please wait for it to finish.');
  }

  aiRequestInFlight = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        response_format: jsonMode ? { type: 'json_object' } : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server Error ${response.status}:`, errorText);
      let detail = `Server responded with ${response.status}`;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.error) detail = parsed.error;
      } catch { /* use default */ }
      throw new Error(detail);
    }

    const data = await response.json();
    return data.content;
  } finally {
    aiRequestInFlight = false;
  }
}

export const identifyWaste = async (imageInput) => {
  try {
    const base64Image = await getBase64Image(imageInput);

    if (!base64Image) {
      throw new Error('Invalid image data');
    }

    const messages = [
      {
        role: 'system',
        content: SNAP_SORT_INSTRUCTION,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Identify this item. Return JSON: { "itemName": "...", "isRecyclable": true/false, "confidence": 0-100, "reasoning": "...", "handlingTips": ["..."] }',
          },
          { type: 'image_url', image_url: { url: base64Image } },
        ],
      },
    ];

    const content = await callMySecureAPI(messages, true);
    return JSON.parse(content);
  } catch (error) {
    console.error('Identify Error:', error);
    throw new Error('System busy');
  }
};

export const chatAboutWaste = async (message, context, options = {}) => {
  try {
    const contextString = context.itemName
      ? `User is currently looking at: ${context.itemName}.`
      : 'General recycling question.';

    const messages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      { role: 'system', content: `CONTEXT: ${contextString}` },
      { role: 'user', content: message },
    ];

    return await callMySecureAPI(messages, false);
  } catch (error) {
    console.error('Chat Error:', error);
    if (options.genericError) {
      throw new Error('System busy');
    }
    return formatAiError(error, 'Eco-AI');
  }
};
