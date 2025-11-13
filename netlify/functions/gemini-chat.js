// netlify/functions/gemini-chat.js
const { GoogleGenAI } = require('@google/genai');

// Ensure you set GEMINI_API_KEY as an environment variable in Netlify
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Define the model for the assistant (using a fast, capable model)
const MODEL = "gemini-2.5-flash";

// Simple system instruction to guide the AI's persona
const systemInstruction = "You are the Podcast Studio Assistant, a helpful, enthusiastic, and knowledgeable expert in podcast planning, production, and guest management. Always provide concise, practical advice relevant to the user's project portal context.";

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body);

    if (!messages || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No messages provided' }),
      };
    }

    // Convert the client-side chat history format to the format expected by the Gemini SDK
    // The history should alternate between 'user' and 'model' roles.
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // The first message will be the user's latest query, which is handled in the `contents` array.

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: contents, // Pass the entire conversation history
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // Extract the text response from the model
    const responseText = response.text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response: responseText }),
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to communicate with the AI assistant.' }),
    };
  }
};