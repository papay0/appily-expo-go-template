/**
 * AI Helper - Text Generation and Image Analysis for Appily Apps
 *
 * This module provides easy-to-use functions for AI features powered by GPT-4o.
 * Configuration is automatically loaded from app.json's extra field.
 *
 * Usage:
 *   import { generateText, analyzeImage, checkAIQuota } from '@/lib/ai';
 *
 *   // Generate text
 *   const poem = await generateText('Write a poem about the ocean');
 *
 *   // Analyze an image
 *   const result = await analyzeImage(base64Image, 'What breed is this dog?');
 *
 *   // Check remaining quota
 *   const quota = await checkAIQuota();
 */

import Constants from 'expo-constants';

/**
 * Configuration loaded from app.json extra field
 * These values are injected during project setup in E2B
 */
const CONFIG = {
  projectId: (Constants.expoConfig?.extra?.appilyProjectId as string) || '',
  apiUrl: (Constants.expoConfig?.extra?.appilyApiUrl as string) || 'https://www.appily.dev',
};

/**
 * Response from the text generation API
 */
export interface GenerateTextResult {
  /** The generated text */
  text: string;
  /** Number of AI requests remaining this period */
  remainingRequests: number;
}

/**
 * Response from the image analysis API
 */
export interface AnalyzeImageResult {
  /** The AI's analysis of the image */
  analysis: string;
  /** Number of AI requests remaining this period */
  remainingRequests: number;
}

/**
 * Response from the quota check API
 */
export interface AIQuotaResult {
  /** Number of AI requests remaining */
  remaining: number;
  /** Maximum requests allowed per period */
  max: number;
  /** When the quota resets (ISO date string) */
  periodEnd: string;
}

/**
 * API response wrapper
 */
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Check if AI features are available (project ID is configured)
 */
export function isAIEnabled(): boolean {
  return Boolean(CONFIG.projectId);
}

/**
 * Generate text using AI (GPT-4o)
 *
 * @param prompt - What you want the AI to generate
 * @param systemPrompt - Optional context/instructions for the AI
 * @returns The generated text and remaining quota
 *
 * @example
 * // Generate a poem
 * const result = await generateText('Write a haiku about spring');
 * console.log(result.text);
 *
 * @example
 * // Generate with custom personality
 * const result = await generateText(
 *   'Tell me a joke',
 *   'You are a comedian who loves puns'
 * );
 */
export async function generateText(
  prompt: string,
  systemPrompt?: string
): Promise<GenerateTextResult> {
  if (!CONFIG.projectId) {
    throw new Error('AI not configured - project ID missing');
  }

  const response = await fetch(`${CONFIG.apiUrl}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: CONFIG.projectId,
      prompt,
      systemPrompt,
      maxTokens: 1024,
      temperature: 0.7,
    }),
  });

  const data: APIResponse<{ text: string; remainingRequests: number }> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'AI text generation failed');
  }

  return {
    text: data.data.text,
    remainingRequests: data.data.remainingRequests,
  };
}

/**
 * Analyze an image using AI vision (GPT-4o)
 *
 * @param imageBase64 - Base64 encoded image data (with or without data: prefix)
 * @param prompt - What to analyze about the image
 * @returns The analysis result and remaining quota
 *
 * @example
 * // Identify a dog breed
 * const result = await analyzeImage(photoBase64, 'What breed is this dog?');
 * console.log(result.analysis);
 *
 * @example
 * // Describe image contents
 * const result = await analyzeImage(imageBase64, 'Describe what you see');
 */
export async function analyzeImage(
  imageBase64: string,
  prompt: string
): Promise<AnalyzeImageResult> {
  if (!CONFIG.projectId) {
    throw new Error('AI not configured - project ID missing');
  }

  // Remove data: prefix if present (the API handles both formats)
  const cleanBase64 = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  const response = await fetch(`${CONFIG.apiUrl}/api/ai/vision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: CONFIG.projectId,
      imageBase64: cleanBase64,
      prompt,
      maxTokens: 1024,
    }),
  });

  const data: APIResponse<{ analysis: string; remainingRequests: number }> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'AI image analysis failed');
  }

  return {
    analysis: data.data.analysis,
    remainingRequests: data.data.remainingRequests,
  };
}

/**
 * Analyze an image from URL using AI vision (GPT-4o)
 *
 * @param imageUrl - URL of the image to analyze
 * @param prompt - What to analyze about the image
 * @returns The analysis result and remaining quota
 *
 * @example
 * const result = await analyzeImageUrl(
 *   'https://example.com/dog.jpg',
 *   'What breed is this dog?'
 * );
 */
export async function analyzeImageUrl(
  imageUrl: string,
  prompt: string
): Promise<AnalyzeImageResult> {
  if (!CONFIG.projectId) {
    throw new Error('AI not configured - project ID missing');
  }

  const response = await fetch(`${CONFIG.apiUrl}/api/ai/vision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: CONFIG.projectId,
      imageUrl,
      prompt,
    }),
  });

  const data: APIResponse<{ analysis: string; remainingRequests: number }> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'AI image analysis failed');
  }

  return {
    analysis: data.data.analysis,
    remainingRequests: data.data.remainingRequests,
  };
}

/**
 * Check remaining AI quota for this project
 *
 * @returns Current quota status
 *
 * @example
 * const quota = await checkAIQuota();
 * console.log(`${quota.remaining}/${quota.max} requests remaining`);
 * console.log(`Resets on: ${new Date(quota.periodEnd).toLocaleDateString()}`);
 */
export async function checkAIQuota(): Promise<AIQuotaResult> {
  if (!CONFIG.projectId) {
    throw new Error('AI not configured - project ID missing');
  }

  const response = await fetch(
    `${CONFIG.apiUrl}/api/ai/usage?projectId=${CONFIG.projectId}`
  );

  const data: APIResponse<{
    remainingRequests: number;
    maxRequests: number;
    periodEnd: string;
  }> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Failed to check AI quota');
  }

  return {
    remaining: data.data.remainingRequests,
    max: data.data.maxRequests,
    periodEnd: data.data.periodEnd,
  };
}
