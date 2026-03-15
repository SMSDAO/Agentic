import { NextRequest, NextResponse } from 'next/server';
import { createSolanaAgent } from '@/lib/ai/langchain';
import { AGENTIC_COPILOT_SYSTEM_PROMPT } from '@/lib/ai/agentic-copilot-system-prompt';

export async function POST(request: NextRequest) {
  try {
    const { prompt, copilot } = await request.json();

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
    const systemPrompt = copilot === true ? AGENTIC_COPILOT_SYSTEM_PROMPT : undefined;
    const response = await agent.execute(prompt, systemPrompt);

    return NextResponse.json({ response });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error executing AI agent:', error);
    return NextResponse.json(
      { error: 'Failed to execute AI agent' },
      { status: 500 }
    );
  }
}
