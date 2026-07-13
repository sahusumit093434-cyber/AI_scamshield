import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let aiModel = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_google_gemini_api_key_here') {
  try {
    const ai = new GoogleGenerativeAI(apiKey);
    aiModel = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Gemini AI Service initialized successfully.');
  } catch (error) {
    console.error('Error initializing Gemini AI Service:', error.message);
  }
} else {
  console.log('Gemini API key not configured. Using rule-based fallback scam analyzer.');
}

/**
 * Clean and parse JSON response from Gemini
 */
function parseGeminiResponse(text) {
  try {
    // Strip markdown formatting if any (e.g. ```json ... ```)
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse Gemini output as JSON:', text);
    throw new Error('AI response parsing failed');
  }
}

/**
 * Heuristic/Rule-based scanner used when no API key is present
 */
function runFallbackAnalysis(text, type = 'text') {
  const lowercaseText = text.toLowerCase();
  const redFlags = [];
  const recommendations = [];
  let score = 5; // base score for safe

  // 1. Check for urgency / threat indicators
  const urgencyKeywords = ['urgent', 'immediately', 'within 24 hours', 'within 2 hours', 'expires', 'suspended', 'blocked', 'action required', 'unauthorized transaction', 'arrest'];
  const urgencyMatches = urgencyKeywords.filter(kw => lowercaseText.includes(kw));
  if (urgencyMatches.length > 0) {
    score += urgencyMatches.length * 15;
    redFlags.push(`Creates false urgency or panic (matched keywords: ${urgencyMatches.join(', ')})`);
  }

  // 2. Financial / Prize indicators
  const moneyKeywords = ['won', 'prize', 'lottery', 'reward', 'cashback', 'gift card', 'free money', 'millions', 'jackpot', 'claims bonus', 'earn money from home', 'upi refund'];
  const moneyMatches = moneyKeywords.filter(kw => lowercaseText.includes(kw));
  if (moneyMatches.length > 0) {
    score += moneyMatches.length * 20;
    redFlags.push(`Promises high returns, free money, or lottery wins (matched keywords: ${moneyMatches.join(', ')})`);
  }

  // 3. Credential / Security Phishing indicators
  const securityKeywords = ['verify your account', 'reset your password', 'security update', 'bank details', 'otp verification', 'login to resolve', 'kyc update'];
  const securityMatches = securityKeywords.filter(kw => lowercaseText.includes(kw));
  if (securityMatches.length > 0) {
    score += securityMatches.length * 20;
    redFlags.push(`Requests verification of sensitive details or passwords (matched keywords: ${securityMatches.join(', ')})`);
  }

  // 4. Look for links/URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];
  if (urls.length > 0) {
    score += 15;
    redFlags.push(`Contains external links requiring you to click out of the context`);
    
    // Check for suspicious domains
    const suspiciousDomainKeywords = ['bit.ly', 'tinyurl.com', 'forms.gle', 'free-gift', 'win-prize', 'secure-login', 'verify-bank'];
    const suspiciousUrls = urls.filter(url => suspiciousDomainKeywords.some(kw => url.includes(kw)));
    if (suspiciousUrls.length > 0) {
      score += 25;
      redFlags.push(`Contains shortened or highly suspicious domains (e.g. ${suspiciousUrls.join(', ')})`);
    }
  }

  // 5. Look for phone numbers or UPI handles
  const upiRegex = /[a-zA-Z0-9.\-_]+@[a-zA-Z]+/g;
  const upiMatches = text.match(upiRegex) || [];
  if (upiMatches.length > 0) {
    score += 20;
    redFlags.push(`Asks to pay or transact with specific UPI IDs (e.g. ${upiMatches.join(', ')})`);
  }

  // Cap score between 0 and 100
  score = Math.min(Math.max(score, 0), 100);

  // Determine Risk Level
  let riskLevel = 'Safe';
  if (score >= 40 && score < 75) {
    riskLevel = 'Suspicious';
  } else if (score >= 75) {
    riskLevel = 'Dangerous';
  }

  // Generate recommendations
  if (riskLevel === 'Safe') {
    recommendations.push('This text seems standard, but always verify sender identity before sharing private details.');
    recommendations.push('Do not share passwords or OTPs even if the message looks legitimate.');
  } else {
    recommendations.push('Do NOT click on any links provided in this message.');
    recommendations.push('Never share one-time passwords (OTP), banking credentials, or personal identity documents.');
    recommendations.push('Verify the claims through the official customer care channel of the respective service (bank, courier, government).');
    if (upiMatches.length > 0) {
      recommendations.push('Do NOT transfer money or do test transactions to the requested UPI handle.');
    }
  }

  // Generic explanations based on score
  let explanation = '';
  if (riskLevel === 'Safe') {
    explanation = 'The system evaluated the provided content and found no typical scam identifiers, urgent threat phrases, or high-risk phishing links. It appears normal.';
  } else if (riskLevel === 'Suspicious') {
    explanation = 'This content contains elements commonly seen in online scams, such as request for action/links or minor indicators of financial reward, but it lacks extreme threat language. Exercise caution.';
  } else {
    explanation = 'CRITICAL: High probability of fraud. The message exhibits classic scam signatures, including false urgency, requests for immediate transaction/actions, or known phishing triggers. Avoid any engagement.';
  }

  return {
    scamScore: score,
    riskLevel,
    explanation,
    redFlags,
    recommendations
  };
}

/**
 * Principal scam analyzer method
 * Supports text and OCR inputs
 */
export async function analyzeScamText(text, type = 'text') {
  if (!text || text.trim() === '') {
    throw new Error('Analysis input text is empty');
  }

  if (!aiModel) {
    // Fallback to rules if Gemini is offline
    return runFallbackAnalysis(text, type);
  }

  const prompt = `
  You are an expert cybersecurity scam detection assistant.
  Analyze the following content (extracted via ${type}) for online scams, phishing attempts, financial fraud, impersonation, or credential theft:
  
  Content:
  """
  ${text}
  """
  
  Return a valid JSON object EXACTLY in the format below. Do not output any text other than the JSON block.
  
  {
    "scamScore": (Number between 0 and 100 representing the probability of this being a scam),
    "riskLevel": (String: either "Safe", "Suspicious", or "Dangerous"),
    "explanation": "A concise paragraph explaining why this message was flagged or marked safe, specifying the scam vectors identified.",
    "redFlags": ["Red flag indicator 1", "Red flag indicator 2"],
    "recommendations": ["Actionable safety recommendation 1", "Actionable safety recommendation 2"]
  }
  `;

  try {
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const jsonResult = parseGeminiResponse(response.text());
    
    // Ensure all required fields exist
    return {
      scamScore: typeof jsonResult.scamScore === 'number' ? jsonResult.scamScore : 50,
      riskLevel: ['Safe', 'Suspicious', 'Dangerous'].includes(jsonResult.riskLevel) ? jsonResult.riskLevel : 'Suspicious',
      explanation: jsonResult.explanation || 'Analyzed by AI backend.',
      redFlags: Array.isArray(jsonResult.redFlags) ? jsonResult.redFlags : [],
      recommendations: Array.isArray(jsonResult.recommendations) ? jsonResult.recommendations : []
    };
  } catch (error) {
    console.error('Gemini API call failed, falling back to local analyzer. Error:', error.message);
    return runFallbackAnalysis(text, type);
  }
}
