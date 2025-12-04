/**
 * Error Reporter - Captures and reports runtime errors to Appily backend
 *
 * This module provides automatic error reporting for Expo Go apps built with Appily.
 * It captures JS exceptions, React render errors, and unhandled promise rejections,
 * then sends them to the Appily API for display in the chat interface.
 *
 * Configuration is injected via app.json's extra field during project setup.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Structure of a runtime error to be reported
 */
export interface RuntimeError {
  message: string;
  stack?: string;
  componentStack?: string;
  filename?: string;
  lineNumber?: number;
  columnNumber?: number;
  errorType: 'js_error' | 'react_error' | 'unhandled_promise';
  timestamp: string;
}

/**
 * Payload sent to the error reporting API
 */
interface ErrorReportPayload {
  projectId: string;
  error: RuntimeError;
  deviceInfo: {
    platform: string;
    version: string;
  };
}

/**
 * Configuration loaded from app.json extra field
 * These values are injected during project setup in E2B
 */
const CONFIG = {
  projectId: (Constants.expoConfig?.extra?.appilyProjectId as string) || '',
  apiEndpoint: (Constants.expoConfig?.extra?.appilyApiUrl as string) || 'https://appily.dev',
};

// Deduplication state to prevent flooding with identical errors
let lastErrorHash = '';
let lastErrorTime = 0;
const DEDUPE_WINDOW_MS = 5000; // 5 seconds

/**
 * Generate a hash for an error to detect duplicates
 */
function hashError(error: RuntimeError): string {
  return `${error.message}-${error.filename || 'unknown'}-${error.lineNumber || 0}`;
}

/**
 * Extract filename and line number from an error stack trace
 */
function parseStackTrace(stack?: string): { filename?: string; lineNumber?: number; columnNumber?: number } {
  if (!stack) return {};

  // Match common stack trace patterns
  // Example: "at ComponentName (filename.tsx:123:45)"
  // Or: "filename.tsx:123:45"
  const patterns = [
    /at\s+\S+\s+\(([^:]+):(\d+):(\d+)\)/,
    /at\s+([^:]+):(\d+):(\d+)/,
    /([^:\s]+):(\d+):(\d+)/,
  ];

  const lines = stack.split('\n');
  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return {
          filename: match[1],
          lineNumber: parseInt(match[2], 10),
          columnNumber: parseInt(match[3], 10),
        };
      }
    }
  }

  return {};
}

/**
 * Report an error to the Appily backend
 *
 * This function is called by:
 * - Global JS error handler (ErrorUtils.setGlobalHandler)
 * - React ErrorBoundary (componentDidCatch)
 * - Unhandled promise rejection handler
 *
 * Features:
 * - Deduplicates identical errors within 5 seconds
 * - Silently fails if network unavailable (won't break the app)
 * - Skips reporting if projectId not configured
 *
 * @param error - The error details to report
 */
export async function reportError(error: RuntimeError): Promise<void> {
  // Skip if project ID not configured (template not yet set up)
  if (!CONFIG.projectId) {
    console.log('[Appily] Skipping error report - no project ID configured');
    return;
  }

  // Parse stack trace for location info if not provided
  if (!error.filename && error.stack) {
    const parsed = parseStackTrace(error.stack);
    error.filename = parsed.filename;
    error.lineNumber = parsed.lineNumber;
    error.columnNumber = parsed.columnNumber;
  }

  // Deduplicate rapid-fire errors (same error within 5 seconds)
  const errorHash = hashError(error);
  const now = Date.now();
  if (errorHash === lastErrorHash && now - lastErrorTime < DEDUPE_WINDOW_MS) {
    console.log('[Appily] Duplicate error suppressed');
    return;
  }
  lastErrorHash = errorHash;
  lastErrorTime = now;

  // Truncate large stack traces to prevent massive payloads
  const MAX_STACK_LENGTH = 5000;
  if (error.stack && error.stack.length > MAX_STACK_LENGTH) {
    error.stack = error.stack.substring(0, MAX_STACK_LENGTH) + '\n... (truncated)';
  }
  if (error.componentStack && error.componentStack.length > MAX_STACK_LENGTH) {
    error.componentStack = error.componentStack.substring(0, MAX_STACK_LENGTH) + '\n... (truncated)';
  }

  const payload: ErrorReportPayload = {
    projectId: CONFIG.projectId,
    error,
    deviceInfo: {
      platform: Platform.OS,
      version: String(Platform.Version ?? 'unknown'),
    },
  };

  console.log('[Appily] Reporting error:', error.message);

  try {
    const response = await fetch(`${CONFIG.apiEndpoint}/api/errors/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('[Appily] Failed to report error:', response.status);
    } else {
      console.log('[Appily] Error reported successfully');
    }
  } catch (e) {
    // Silently fail - don't break the app if error reporting fails
    console.warn('[Appily] Error reporting failed:', e);
  }
}

/**
 * Check if error reporting is enabled (projectId is configured)
 */
export function isErrorReportingEnabled(): boolean {
  return Boolean(CONFIG.projectId);
}
