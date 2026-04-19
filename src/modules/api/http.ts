import { NextResponse } from 'next/server';

export function jsonError(message: string, status = 400, init?: ResponseInit): NextResponse {
  const restInit = init ? { ...init } : {};
  if ('status' in restInit) {
    delete restInit.status;
  }

  return NextResponse.json(
    { error: message },
    { ...restInit, status }
  );
}
