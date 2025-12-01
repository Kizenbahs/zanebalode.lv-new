/**
 * Environment variable validation and type-safe access
 * This ensures all required environment variables are present and valid
 */

interface Env {
  GEMINI_API_KEY?: string;
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_URL?: string;
}

function getEnv(): Env {
  const env: Env = {
    NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'development',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };

  // Validate required environment variables in production
  if (env.NODE_ENV === 'production') {
    const requiredVars: (keyof Env)[] = [];
    const missing: string[] = [];

    requiredVars.forEach((key) => {
      if (!env[key]) {
        missing.push(key);
      }
    });

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  }

  return env;
}

// Validate and export environment variables
export const env = getEnv();

// Type-safe environment variable getters
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

