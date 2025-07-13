import {
  GoogleGenAI,
  createUserContent,
  createPartFromBase64,
} from "@google/genai";

import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export const generateCaption = async (req, res) => {
  try {
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Optimize image
    const optimizedBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Convert to base64
    const base64Image = optimizedBuffer.toString('base64');

    // Generate caption using inline image
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        createUserContent([
          'Generate a short, catchy social media caption for this travel photo:',
          createPartFromBase64(base64Image, 'image/jpeg'),
        ]),
      ],
    });

    // Safely extract text
    const caption =
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'No caption generated';

    return res.status(200).json({ caption });
  } catch (err) {
    console.error('AI Caption Error:', err.message || err);
    return res.status(500).json({ message: 'Failed to generate caption' });
  }
};
