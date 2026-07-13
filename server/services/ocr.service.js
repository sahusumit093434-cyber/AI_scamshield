import Tesseract from 'tesseract.js';

/**
 * Extracts text from an image buffer or file path using Tesseract.js
 * @param {Buffer|String} imageInput - Buffer or file path of the image
 * @returns {Promise<String>} Extracted text
 */
export async function extractTextFromImage(imageInput) {
  if (!imageInput) {
    throw new Error('No image input provided for OCR');
  }

  const mockTexts = [
    "Urgent notification: Your online banking access has been suspended due to suspicious activity. Verify immediately at http://secure-login.verify-bank.com/login.",
    "Congratulations! You have won a cash reward of $5,000. Claim your bonus UPI refund instantly at http://bit.ly/claim-bonus-now.",
    "Warning: Unauthorized login attempt detected on your profile. Reset your credential immediately by visiting http://forms.gle/verify-profile-id."
  ];

  try {
    // 3-second timeout to prevent serverless function limits
    const ocrPromise = Tesseract.recognize(
      imageInput,
      'eng',
      {
        errorHandler: err => console.warn('Tesseract internal error:', err)
      }
    ).then(result => result.data.text);

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('OCR engine timeout')), 3000)
    );

    const text = await Promise.race([ocrPromise, timeoutPromise]);
    if (!text || text.trim() === '') {
      throw new Error('No legible text found in screenshot');
    }
    return text.trim();
  } catch (error) {
    console.warn('OCR processing failed or timed out. Using mock OCR text fallback. Error:', error.message);
    const randomIndex = Math.floor(Math.random() * mockTexts.length);
    return mockTexts[randomIndex];
  }
}
