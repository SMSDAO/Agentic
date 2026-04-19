import { NextResponse } from 'next/server';

export function jsonError(message: string, status = 400, init?: ResponseInit): NextResponse {
  return NextResponse.json(
    { error: message },
    { ...init, status: init?.status ?? status }
  );
}
