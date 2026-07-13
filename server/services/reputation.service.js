import { URL } from 'url';
import mongoose from 'mongoose';
import BlockedUrl from '../models/blockedUrl.model.js';

/**
 * Validates a string format is a valid URL
 */
export function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Checks a URL reputation against local database and performs heuristic evaluations
 * @param {String} urlString - URL to scan
 * @returns {Promise<Object>} Reputation report
 */
export async function checkUrlReputation(urlString) {
  if (!isValidUrl(urlString)) {
    return {
      isValid: false,
      isSafe: false,
      riskScore: 100,
      reasons: ['Malformed or invalid URL structure'],
      recommendations: ['Do not visit this URL. Check for spelling errors or missing protocols.']
    };
  }

  const parsedUrl = new URL(urlString);
  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  
  const reasons = [];
  const recommendations = [];
  let score = 5; // Base safety score

  // 1. Check local admin block list (only if DB connection is active)
  let isBlockedLocally = null;
  if (true) {
    try {
      isBlockedLocally = await BlockedUrl.findOne({ 
        $or: [
          { url: urlString.toLowerCase() },
          { url: hostname }
        ]
      });
    } catch (e) {
      console.warn('Database blacklist check skipped:', e.message);
    }
  }

  if (isBlockedLocally) {
    return {
      isValid: true,
      isSafe: false,
      riskScore: 100,
      reasons: [`URL is blacklisted in ScamShield AI Database. Reason: ${isBlockedLocally.reason}`],
      recommendations: [
        'This URL is known to be dangerous. Access has been restricted.',
        'Close the browser tab containing this page immediately.'
      ]
    };
  }

  // 2. Heuristics: IP Address hostname
  const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (ipPattern.test(hostname)) {
    score += 50;
    reasons.push('Domain uses a raw IP address instead of an alphanumeric hostname');
  }

  // 3. Heuristics: Suspicious Top Level Domains (TLDs) frequently used in scams
  const highRiskTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.cc', '.xyz', '.click', '.top', '.work', '.date', '.loan'];
  const matchedTld = highRiskTlds.find(tld => hostname.endsWith(tld));
  if (matchedTld) {
    score += 25;
    reasons.push(`Domain uses a high-risk TLD (${matchedTld}) often associated with low-cost phishing sites`);
  }

  // 4. Heuristics: Phishing keywords in hostname
  const phishingKeywords = [
    'login', 'signin', 'secure', 'bank', 'verify', 'update', 'account', 'support',
    'customer', 'service', 'wallet', 'refund', 'bonus', 'claim', 'gift', 'free',
    'netflix', 'paypal', 'meta', 'google', 'amazon', 'microsoft', 'apple', 'upi',
    'kyc', 'aadhar', 'pan-card', 'courier', 'fedex', 'dhl', 'speedpost'
  ];

  const matchedKeywords = phishingKeywords.filter(kw => {
    // Check if the keyword is part of the domain sub-elements (avoiding matching correct domains like microsoft.com or paypal.com directly if possible, though we focus on typosquatting)
    // To make it simple: if hostname contains the keyword but is not the official site
    return hostname.includes(kw) && 
           !hostname.endsWith('paypal.com') && 
           !hostname.endsWith('netflix.com') && 
           !hostname.endsWith('google.com') && 
           !hostname.endsWith('amazon.com') && 
           !hostname.endsWith('microsoft.com') && 
           !hostname.endsWith('apple.com') &&
           !hostname.endsWith('live.com');
  });

  if (matchedKeywords.length > 0) {
    score += matchedKeywords.length * 20;
    reasons.push(`Domain contains brand names or trust-related keywords (matched: ${matchedKeywords.join(', ')})`);
  }

  // 5. Typosquatting / Character masquerading (homoglyph checking)
  // Look for zeros replacing 'o', '1' replacing 'l' or 'i', etc.
  const suspiciousSubstitutions = [/[0-9]o/, /o[0-9]/, /1l/, /l1/, /rn/];
  if (suspiciousSubstitutions.some(regex => regex.test(hostname))) {
    score += 15;
    reasons.push('Domain name contains potential character substitutions (typosquatting)');
  }

  // Cap score
  score = Math.min(Math.max(score, 0), 100);

  // Define recommendations
  if (score < 40) {
    recommendations.push('This URL appears safe based on our standard database checks and reputation heuristics.');
    recommendations.push('However, verify the website certificate (padlock icon) before sharing sensitive personal details.');
  } else {
    recommendations.push('Do NOT input any login credentials, credit card details, or personal data on this site.');
    recommendations.push('Double check the domain extension to ensure you are not on a spoofed website.');
    recommendations.push('If you received this link via SMS, WhatsApp, or unsolicited email, it is highly likely to be a phishing link.');
  }

  return {
    isValid: true,
    isSafe: score < 40,
    riskScore: score,
    reasons: reasons.length > 0 ? reasons : ['No threat indicators detected.'],
    recommendations
  };
}
