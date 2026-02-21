import OpenAI from 'openai';

/**
 * Creates a streaming OpenAI response.
 * Must only be called from server-side code (API routes, Server Actions).
 */
export async function createOpenAIStream(
  prompt: string,
  apiKey?: string
): Promise<ReadableStream<Uint8Array>> {
  const client = new OpenAI({
    apiKey: apiKey ?? process.env.OPENAI_API_KEY,
  });

  const stream = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });
}
