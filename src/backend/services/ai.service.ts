import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface DiagnosticResult {
  diagnosis: string;
  estimatedCost: string;
  suggestedParts: string[];
  complexity: 'Low' | 'Medium' | 'High';
}

// Simple in-memory cache to prevent redundant AI calls
const diagnosticCache: Record<string, { result: DiagnosticResult; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour
const RATE_LIMIT_MS = 5000; // 5 seconds between calls
let lastCallTime = 0;

export const AIService = {
  /**
   * Generates a diagnostic report based on device details and issue description
   */
  async getRepairDiagnosis(deviceDetails: string, issue: string): Promise<DiagnosticResult | null> {
    if (!API_KEY) {
      console.warn('Gemini API key is missing. AI features will be disabled.');
      return null;
    }

    const cacheKey = `${deviceDetails}:${issue}`;
    const now = Date.now();

    // Check Cache First
    if (diagnosticCache[cacheKey] && now - diagnosticCache[cacheKey].timestamp < CACHE_TTL) {
      return diagnosticCache[cacheKey].result;
    }

    // Rate Limiting
    if (now - lastCallTime < RATE_LIMIT_MS) {
      console.warn('Rate Limit: AI diagnosis requested too soon.');
      return null;
    }

    try {
      lastCallTime = now;
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        You are a professional hardware repair diagnostic assistant for SAM-B TECH. 
        Analyze the following device repair request and provide a JSON response with:
        1. "diagnosis": A detailed explanation of the likely technical issue.
        2. "estimatedCost": A price range in NGN (e.g., "₦15,000 - ₦25,000").
        3. "suggestedParts": A list of replacement parts likely needed.
        4. "complexity": "Low", "Medium", or "High" based on the repair difficulty.

        Device: ${deviceDetails}
        Reported Issue: ${issue}

        Return ONLY raw JSON without markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response in case it includes markdown code blocks
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson) as DiagnosticResult;
      
      // Store in cache
      diagnosticCache[cacheKey] = { result: parsed, timestamp: now };
      
      return parsed;
    } catch (error) {
      console.error('AI Diagnosis Error:', error);
      return null;
    }
  }
};
