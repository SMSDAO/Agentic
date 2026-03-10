/**
 * Direct OpenAI service — use for simple completions and image generation
 * without LangChain overhead.
 *
 * Server-only: reads OPENAI_API_KEY from process.env and imports the Node
 * OpenAI SDK. Do not import from client components.
 */

import 'server-only';
import OpenAI from 'openai';

export interface CompletionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface ImageGenerationOptions {
  model?: 'dall-e-3' | 'dall-e-2';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  n?: number;
}

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey?: string) {
    const key = apiKey ?? process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({ apiKey: key });
  }

  async complete(prompt: string, options: CompletionOptions = {}): Promise<string> {
    const {
      model = 'gpt-4',
      maxTokens = 1024,
      temperature = 0.7,
      systemPrompt,
    } = options;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.client.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    });

    return response.choices[0]?.message?.content ?? '';
  }

  async generateImage(
    prompt: string,
    options: ImageGenerationOptions = {}
  ): Promise<string[]> {
    const {
      model = 'dall-e-3',
      size = '1024x1024',
      quality = 'standard',
      n = 1,
    } = options;

    const response = await this.client.images.generate({
      model,
      prompt,
      size,
      quality,
      n,
    });

    return response.data?.map((img) => img.url ?? '').filter(Boolean) ?? [];
  }
}

export function createOpenAIService(apiKey?: string): OpenAIService {
  return new OpenAIService(apiKey);
}
