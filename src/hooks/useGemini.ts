import { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { config } from '../config';

export const PromptType = {
  PARAPHRASER: 'paraphraser',
  SUMMARIZER: 'summarizer',
  CONVERTER: 'converter',
} as const;

export type PromptType = typeof PromptType[keyof typeof PromptType];

interface UseGeminiOptions {
  model?: string;
}

interface GenerateContentParams {
  prompt: string;
  type: PromptType;
}

export const useGemini = (options: UseGeminiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genAI = useMemo(() => new GoogleGenAI({ apiKey: config.geminiApiKey }), []);

  const generateContent = useCallback(
    async ({ prompt, type }: GenerateContentParams): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        // Enhance prompt based on type
        const enhancedPrompt = getEnhancedPrompt(prompt, type);
        
        const response = await genAI.models.generateContent({
          model: options.model || 'gemini-2.0-flash-exp',
          contents: enhancedPrompt,
        });
        
        const text = response.text || '';
        
        setLoading(false);
        return text;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [genAI, options.model]
  );

  return {
    generateContent,
    loading,
    error,
  };
};

// Helper function to enhance prompts based on type
function getEnhancedPrompt(prompt: string, type: PromptType): string {
  const prefixes = {
    [PromptType.PARAPHRASER]: 'Paraphrase the following text while maintaining its meaning:\n\n',
    [PromptType.SUMMARIZER]: 'Summarize the following text concisely:\n\n',
    [PromptType.CONVERTER]: 'Convert the following content as requested:\n\n',
  };

  return prefixes[type] + prompt;
}
