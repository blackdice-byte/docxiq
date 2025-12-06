// Environment variables configuration
export const config = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
} as const;

// Validate required environment variables
if (!config.geminiApiKey) {
  console.warn('Warning: VITE_GEMINI_API_KEY is not set in environment variables');
}
