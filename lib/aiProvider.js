import OpenAI from 'openai';

const resolveProvider = (env = process.env) => {
  const explicit = (env.AI_PROVIDER || '').toLowerCase();
  if (explicit === 'gemini' || explicit === 'openai') return explicit;
  if (env.GEMINI_API_KEY) return 'gemini';
  if (env.OPENAI_API_KEY) return 'openai';
  return null;
};

const contentToGeminiParts = (content) => {
  if (typeof content === 'string') return [{ text: content }];

  if (Array.isArray(content)) {
    return content.map((part) => {
      if (part.type === 'text') return { text: part.text };
      if (part.type === 'image_url') {
        const url = part.image_url?.url || '';
        const match = url.match(/^data:(.*?);base64,(.*)$/);
        if (match) {
          return {
            inline_data: {
              mime_type: match[1] || 'image/jpeg',
              data: match[2],
            },
          };
        }
      }
      return null;
    }).filter(Boolean);
  }

  return [{ text: String(content ?? '') }];
};

const parseMessages = (messages = []) => {
  let systemInstruction = '';
  const turns = [];

  for (const msg of messages) {
    if (msg.role === 'system') {
      const text = typeof msg.content === 'string' ? msg.content : '';
      systemInstruction = systemInstruction ? `${systemInstruction}\n\n${text}` : text;
      continue;
    }

    if (msg.role === 'user') {
      turns.push({ role: 'user', parts: contentToGeminiParts(msg.content) });
    } else if (msg.role === 'assistant') {
      turns.push({ role: 'model', parts: contentToGeminiParts(msg.content) });
    }
  }

  return { systemInstruction, turns };
};

async function callOpenAI({ messages, model, response_format }, env) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: model || 'gpt-4o-mini',
    messages,
    response_format: response_format || undefined,
  });

  return completion.choices[0].message;
}

async function callGeminiOnce({ messages, response_format }, env, modelName) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const { systemInstruction, turns } = parseMessages(messages);
  const lastUser = [...turns].reverse().find((t) => t.role === 'user');
  if (!lastUser) throw new Error('No user message provided');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ role: 'user', parts: lastUser.parts }],
    generationConfig: response_format?.type === 'json_object'
      ? { responseMimeType: 'application/json' }
      : undefined,
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || `Gemini API error (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .filter(Boolean)
    .join('') || '';

  if (!text) throw new Error('Gemini returned an empty response');

  return { role: 'assistant', content: text };
}

const GEMINI_MODEL_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-flash-latest',
];

const geminiModelsToTry = (env) => {
  const preferred = env.GEMINI_MODEL || 'gemini-2.5-flash';
  return [...new Set([preferred, ...GEMINI_MODEL_FALLBACKS])];
};

const isRetryableGeminiError = (error) => {
  if (error.status === 404 || error.status === 429) return true;
  const msg = error.message || '';
  return msg.includes('not found')
    || msg.includes('not supported')
    || msg.includes('quota')
    || msg.includes('RESOURCE_EXHAUSTED')
    || msg.includes('limit: 0');
};

async function callGemini(payload, env) {
  const models = geminiModelsToTry(env);
  let lastError;

  for (const modelName of models) {
    try {
      return await callGeminiOnce(payload, env, modelName);
    } catch (error) {
      lastError = error;
      if (!isRetryableGeminiError(error)) throw error;
      console.warn(`[aiProvider] ${modelName} unavailable, trying next model...`, error.message);
    }
  }

  throw lastError;
}

export async function handleAiChatRequest(body, env = process.env) {
  const provider = resolveProvider(env);
  if (!provider) {
    throw new Error('No AI provider configured. Set GEMINI_API_KEY or OPENAI_API_KEY in .env.local');
  }

  const payload = {
    messages: body.messages,
    model: body.model,
    response_format: body.response_format,
  };

  if (provider === 'gemini') {
    return callGemini(payload, env);
  }

  return callOpenAI(payload, env);
}

export { resolveProvider };
