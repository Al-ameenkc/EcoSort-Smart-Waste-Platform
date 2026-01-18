// api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This runs on the server, so it's safe!
});

export default async function handler(req, res) {
  // Allow the browser to talk to this function (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { messages, model } = req.body;

    // Call OpenAI from the secure server
    const completion = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: messages,
      response_format: req.body.response_format || undefined // Pass JSON format if requested
    });

    // Send the answer back to your frontend
    res.status(200).json(completion.choices[0].message);

  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Error processing request" });
  }
}