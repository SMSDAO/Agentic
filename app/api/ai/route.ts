import { NextRequest, NextResponse } from 'next/server';
import { createSolanaAgent } from '@/lib/ai/langchain';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const agent = createSolanaAgent(apiKey);
    const response = await agent.execute(prompt);

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json(
      { error: 'Failed to execute AI agent' },
      { status: 500 }
    );
  }
}
