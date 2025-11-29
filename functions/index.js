// functions/index.js

// --- Firebase and Twilio Imports ---
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// --- Initialize Firebase Admin SDK ---
// This is essential for accessing Firebase services securely from the function
admin.initializeApp();

// --- Configuration for Twilio Token Generation Function ---
// These values are loaded from the environment variables you set using `firebase functions:config:set`
const twilioConfig = functions.config().twilio;
// Check if twilioConfig exists before accessing properties to prevent errors
if (!twilioConfig || !twilioConfig.account_sid || !twilioConfig.api_key_sid || !twilioConfig.api_key_secret) {
    console.error("Twilio configuration missing. Please run `firebase functions:config:set twilio.account_sid=\"...\" twilio.api_key_sid=\"...\" twilio.api_key_secret=\"...\"`");
    // You might want to throw an error or handle this more gracefully depending on your needs.
    // For now, it will likely lead to an error during token generation if config is truly missing.
}
const accountSid = twilioConfig ? twilioConfig.account_sid : 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Fallback to placeholder if config missing
const apiKeySid = twilioConfig ? twilioConfig.api_key_sid : 'SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';   // Fallback to placeholder if config missing
const apiKeySecret = twilioConfig ? twilioConfig.api_key_secret : 'your_twilio_api_key_secret'; // Fallback to placeholder if config missing


/**
 * Firebase Callable Cloud Function to generate a Twilio Access Token for a video room.
 * This function should be called from the client-side (e.g., your React app)
 * to securely obtain a token without exposing Twilio API keys.
 */
exports.generateTwilioToken = functions.https.onCall(async (data, context) => {
    // 1. Authentication Check: Ensure the caller is an authenticated Firebase user
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }
    const userId = context.auth.uid; // The authenticated Firebase User ID will be used as Twilio Identity

    // 2. Input Validation: Ensure a roomName is provided
    const roomName = data.roomName;
    if (!roomName || typeof roomName !== 'string' || roomName.trim().length === 0) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with a non-empty "roomName" string.'
        );
    }

    // 3. Create a new Twilio Access Token
    // The `identity` parameter is crucial: it identifies the user within the Twilio room.
    const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
        identity: userId
    });

    // 4. Create a Video Grant for the token, specifying the room the user can join
    const videoGrant = new VideoGrant({
        room: roomName,
    });
    token.addGrant(videoGrant);

    // 5. Return the generated token as a JWT string
    return { token: token.toJwt() };
});


// --- Configuration and Logic for analyzeDatingMessage Function ---
const SUSPICIOUS_KEYWORDS = [
  "crypto", "bitcoin", "ethereum", "investment", "money transfer",
  "western union", "gift card", "bank account", "urgent funds",
  "financial aid", "inheritance", "customs fee", "lucky winner",
  "secret", "don't tell anyone", "urgent help", "stranded",
  "lonely", "dating site", "cam girl", "sugar daddy", "adult",
  "i'm a soldier", "military deployment", "oil rig worker",
  "widowed", "orphan", "poor internet connection",
];

const URGENCY_PHRASES = [
  "act now", "immediately", "urgent", "critical", "deadline",
  "before it's too late", "must transfer", "respond quickly",
  "in a hurry", "rush",
];

/**
 * Firebase Callable Cloud Function to analyze a message for suspicious content,
 * potentially indicating a scam or bot behavior.
 */
exports.analyzeDatingMessage = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // 2. Input Validation
  const message = data.message;
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The 'message' parameter must be a non-empty string."
    );
  }

  const cleanMessage = message.toLowerCase(); // For case-insensitive checks
  let score = 0; // Higher score indicates higher likelihood of scam/bot
  const flags = [];
  const advice = [];

  // 3. Keyword Analysis
  SUSPICIOUS_KEYWORDS.forEach(keyword => {
    if (cleanMessage.includes(keyword)) {
      score += 10; // Increase score for each suspicious keyword
      flags.push(`Contains suspicious keyword: "${keyword}"`);
    }
  });

  // 4. Urgency/Pressure Analysis
  URGENCY_PHRASES.forEach(phrase => {
    if (cleanMessage.includes(phrase)) {
      score += 8; // Increase score for urgency
      flags.push(`Detects urgent or high-pressure language: "${phrase}"`);
    }
  });

  // 5. Link Detection (simple check for http/https)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = cleanMessage.match(urlRegex);
  if (urls && urls.length > 0) {
    score += urls.length * 5; // Score based on number of links
    flags.push(`Contains external links (${urls.length} detected).`);
    advice.push("Be extremely cautious clicking on unsolicited links.");
  }

  // 6. Common Bot/Scam Patterns (simple example)
  if (cleanMessage.includes("i am a") && cleanMessage.includes("engineer")) {
    score += 5; // Example: specific common bot intros
    flags.push("Contains a common bot introductory phrase.");
  }
  if (cleanMessage.includes("my life is complicated") && cleanMessage.includes("my children")) {
    score += 7; // Example: specific common emotional appeals
    flags.push("Uses emotionally manipulative phrasing.");
  }


  // 7. Determine overall likelihood and advice
  let assessment = "Looks generally safe. Always trust your gut!";
  if (score >= 30) {
    assessment = "High risk of being a scam or bot. Proceed with extreme caution!";
    advice.unshift("Do NOT send money or personal information."); // Add to front
    advice.unshift("Immediately block and report this user.");
  } else if (score >= 15) {
    assessment = "Moderate risk. Be very careful and look for other red flags.";
    advice.unshift("Verify their identity through video call before sharing any personal info.");
  } else if (score > 0) {
    assessment = "Low risk, but some flags detected. Stay vigilant.";
  }

  // Ensure unique advice messages
  const uniqueAdvice = [...new Set(advice)];


  // 8. Return the assessment
  return {
    score: score,
    isScamLikely: score >= 15, // Define a threshold for "scam likely"
    flags: [...new Set(flags)], // Ensure unique flags
    assessment: assessment,
    advice: uniqueAdvice,
    timestamp: new Date().toISOString(),
  };
});
