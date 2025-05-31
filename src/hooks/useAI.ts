
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Initialize the Supabase client with proper error handling
let supabase: any = null;

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mnvvbijaqbxfuodsrqup.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udnZiaWphcWJ4ZnVvZHNycXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODkyODUsImV4cCI6MjA2MzU2NTI4NX0.JsEg-M2sB9p3hVN3h4p-h6j9wQMuhx0P6aW41LtvC1U';
  
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

type AIService = 'doubt-solver' | 'answer-analyzer' | 'question-generator';

type AIResponse = {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export function useAI() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (
    prompt: string,
    service: AIService,
    context: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = []
  ): Promise<AIResponse | null> => {
    console.log('callAI function called with:', { service, promptLength: prompt.length });
    
    setLoading(true);
    setError(null);
    
    if (!supabase) {
      const errorMessage = 'Supabase client not initialized';
      console.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      toast.error(errorMessage);
      return null;
    }
    
    try {
      console.log('Calling Supabase edge function: deepseek-ai');
      
      const { data, error: apiError } = await supabase.functions.invoke('deepseek-ai', {
        body: {
          prompt,
          service,
          context
        }
      });
      
      console.log('Supabase edge function response:', { data, error: apiError });
      
      if (apiError) {
        throw new Error(apiError.message || 'Failed to call AI service');
      }
      
      if (!data) {
        throw new Error('No response received from AI service');
      }
      
      console.log('AI service call successful');
      return data as AIResponse;
    } catch (err) {
      console.error('AI service error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(`AI Error: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateText = async (prompt: string): Promise<string | null> => {
    const response = await callAI(prompt, 'question-generator');
    return response ? response.response : null;
  };

  return {
    generateText,
    loading,
    error
  };
}
