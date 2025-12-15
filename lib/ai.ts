/**
 * AI Helper - Text Generation, Image Analysis, and Image Generation for Appily Apps
 *
 * This module provides easy-to-use functions for AI features:
 * - Text generation powered by GPT-5 mini
 * - Image analysis powered by GPT-5 mini
 * - Image generation/editing powered by Gemini (Nano Banana Pro)
 *
 * Configuration is automatically loaded from app.json's extra field.
 *
 * Usage:
 *   import { generateText, analyzeImage, generateImage, editImage, checkAIQuota } from '@/lib/ai';
 *
 *   // Generate text
 *   const poem = await generateText('Write a poem about the ocean');
 *
 *   // Analyze an image
 *   const result = await analyzeImage(base64Image, 'What breed is this dog?');
 *
 *   // Generate an image from text
 *   const image = await generateImage('A sunset over mountains');
 *
 *   // Edit an existing image
 *   const edited = await editImage(photoBase64, 'Add a rainbow in the sky');
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
 * Generate text using AI (GPT-5 mini)
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
 * Analyze an image using AI vision (GPT-5 mini)
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
 * Analyze an image from URL using AI vision (GPT-5 mini)
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

// ============================================================================
// IMAGE GENERATION (Gemini - Nano Banana Pro)
// ============================================================================

/**
 * Supported aspect ratios for image generation
 */
export type ImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3';

/**
 * Supported image resolutions
 */
export type ImageResolution = '1K' | '2K';

/**
 * Options for image generation
 */
export interface ImageGenerationOptions {
  /** Aspect ratio of the generated image (default: '1:1') */
  aspectRatio?: ImageAspectRatio;
  /** Resolution: '1K' (faster) or '2K' (higher quality) (default: '1K') */
  resolution?: ImageResolution;
}

/**
 * Response from image generation API
 */
export interface GenerateImageResult {
  /** Full data URL for the generated image (data:image/png;base64,...) */
  imageBase64: string;
  /** Number of AI requests remaining this period */
  remainingRequests: number;
}

/**
 * Generate an image from a text prompt using AI (Gemini - Nano Banana Pro)
 *
 * @param prompt - Text description of the image to generate
 * @param options - Optional settings for aspect ratio and resolution
 * @returns The generated image as a data URL and remaining quota
 *
 * @example
 * // Generate a simple image
 * const result = await generateImage('A cute robot playing guitar on a beach');
 * // Use result.imageBase64 directly in an Image component
 *
 * @example
 * // Generate with custom options
 * const result = await generateImage(
 *   'A mountain landscape at sunset',
 *   { aspectRatio: '16:9', resolution: '2K' }
 * );
 */
export async function generateImage(
  prompt: string,
  options?: ImageGenerationOptions
): Promise<GenerateImageResult> {
  if (!CONFIG.projectId) {
    throw new Error('AI not configured - project ID missing');
  }

  const response = await fetch(`${CONFIG.apiUrl}/api/ai/generate-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: CONFIG.projectId,
      prompt,
      aspectRatio: options?.aspectRatio || '1:1',
      resolution: options?.resolution || '1K',
    }),
  });

  const data: APIResponse<{
    imageBase64: string;
    mimeType: string;
    remainingRequests: number;
  }> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'AI image generation failed');
  }

  // Return as full data URL for easy use in Image components
  return {
    imageBase64: `data:${data.data.mimeType};base64,${data.data.imageBase64}`,
    remainingRequests: data.data.remainingRequests,
  };
}

/**
 * Edit an existing image using AI (Gemini - Nano Banana Pro)
 *
 * This function allows you to modify photos with text instructions.
 * Great for adding effects, changing backgrounds, adding objects, etc.
 *
 * @param imageBase64 - Base64-encoded source image (with or without data: prefix)
 * @param prompt - Text description of the edits to make
 * @param options - Optional settings for aspect ratio and resolution
 * @returns The edited image as a data URL and remaining quota
 *
 * @example
 * // Pick a photo and add something to it
 * import * as ImagePicker from 'expo-image-picker';
 *
 * const picked = await ImagePicker.launchImageLibraryAsync({ base64: true });
 * if (picked.assets?.[0]?.base64) {
 *   const result = await editImage(
 *     picked.assets[0].base64,
 *     'Add a colorful parrot on my shoulder'
 *   );
 *   // result.imageBase64 contains the edited image
 * }
 *
 * @example
 * // Change outfit in a photo
 * const result = await editImage(
 *   selfieBase64,
 *   'Change my shirt to a red Hawaiian shirt'
 * );
 */
export async function editImage(
  imageBase64: string,
  prompt: string,
  options?: ImageGenerationOptions
): Promise<GenerateImageResult> {
  if (!CONFIG.projectId) {
    throw new Error('AI not configured - project ID missing');
  }

  const response = await fetch(`${CONFIG.apiUrl}/api/ai/generate-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: CONFIG.projectId,
      prompt,
      imageBase64,
      aspectRatio: options?.aspectRatio || '1:1',
      resolution: options?.resolution || '1K',
    }),
  });

  const data: APIResponse<{
    imageBase64: string;
    mimeType: string;
    remainingRequests: number;
  }> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'AI image editing failed');
  }

  return {
    imageBase64: `data:${data.data.mimeType};base64,${data.data.imageBase64}`,
    remainingRequests: data.data.remainingRequests,
  };
}
