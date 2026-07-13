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

  try {
    const result = await Tesseract.recognize(
      imageInput,
      'eng',
      {
        // Suppress massive logging output but keep basic warnings
        errorHandler: err => console.warn('Tesseract internal error:', err)
      }
    );
    
    const text = result.data.text;
    if (!text || text.trim() === '') {
      throw new Error('No legible text found in screenshot');
    }
    
    return text.trim();
  } catch (error) {
    console.error('OCR Extraction Service Error:', error);
    throw new Error(`Failed to read text from screenshot: ${error.message}`);
  }
}
