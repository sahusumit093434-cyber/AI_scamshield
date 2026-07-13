import axios from 'axios';

const flags = [
  ['urgent', 'Urgency or pressure tactics'],
  ['otp', 'Request for OTP or account credential'],
  ['password', 'Request for sensitive credentials'],
  ['upi', 'Payment/UPI request'],
  ['prize', 'Unexpected prize or reward'],
  ['verify', 'Unsolicited account verification'],
  ['click', 'Pressure to open a link'],
  ['refund', 'Refund scam language'],
  ['gift card', 'Gift-card payment request'],
  ['crypto', 'Cryptocurrency payment request']
];

// Heuristic fallback function
function localHeuristics(input, type) {
  const text = String(input).toLowerCase();
  let hits = flags.filter(([w]) => text.includes(w));
  let score = Math.min(96, hits.length * 13 + (type === 'url' && (/bit\.ly|tinyurl|\.xyz|\.top|\.click/.test(text) ? 30 : 0)) + (text.includes('http') ? 5 : 0));
  if (!score && type === 'url') score = 8;
  const level = score >= 65 ? 'Dangerous' : score >= 25 ? 'Suspicious' : 'Safe';
  return {
    riskScore: score,
    riskLevel: level,
    verdict: level === 'Safe' ? 'Likely safe' : 'Potential scam',
    explanation: score ? `Detected ${hits.length || 'domain'} risk signal${hits.length === 1 ? '' : 's'}. Do not act until the sender or site is independently verified.` : 'No common scam signals were detected. This is not a guarantee of safety.',
    redFlags: hits.map(x => x[1]),
    recommendations: score ? [
      'Do not share OTPs, passwords, or banking details.',
      'Verify via an official website or known phone number.',
      'Do not make payments under pressure.'
    ] : [
      'Stay alert for changes in the conversation.',
      'Verify unexpected requests independently.'
    ]
  };
}

/**
 * Perform scam analysis using OpenAI if API key is present, otherwise fallback to local heuristics.
 */
export async function analyze(input, type = 'text') {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.log('OpenAI API key not configured. Using rule-based fallback analyzer.');
    return localHeuristics(input, type);
  }

  try {
    const prompt = `Analyze this input for potential online scams, phishing attempts, fake coordinates, or fraud.
Input type: ${type}
Input Content: "${input}"

Respond ONLY with a JSON object in this exact format:
{
  "riskScore": (integer between 0 and 100 representing scam probability),
  "riskLevel": ("Safe", "Suspicious", or "Dangerous"),
  "verdict": (short one-sentence summary warning, e.g. "Urgent Action Required" or "Suspicious Domain Signature"),
  "explanation": (detailed explanation of why this input was flagged and how the scam works),
  "redFlags": [(list of specific red flags noticed in the input)],
  "recommendations": [(practical security recommendations for the user)]
}`;

    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an advanced cybersecurity scam analysis expert. Output ONLY valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );

    const json = JSON.parse(res.data.choices[0].message.content);
    return {
      riskScore: typeof json.riskScore === 'number' ? json.riskScore : 50,
      riskLevel: ['Safe', 'Suspicious', 'Dangerous'].includes(json.riskLevel) ? json.riskLevel : 'Suspicious',
      verdict: json.verdict || 'Suspicious Signals Detected',
      explanation: json.explanation || 'The input displays potential warning signs.',
      redFlags: Array.isArray(json.redFlags) ? json.redFlags : [],
      recommendations: Array.isArray(json.recommendations) ? json.recommendations : []
    };
  } catch (err) {
    console.warn('OpenAI API call failed, falling back to local heuristics:', err.message);
    return localHeuristics(input, type);
  }
}
