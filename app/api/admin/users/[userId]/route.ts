import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/client';
import { requireAdmin, logAuditAction } from '@/lib/supabase/auth';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const admin = await requireAdmin();
    const supabase = createSupabaseAdmin();
    const body = await request.json();
    const { userId } = await context.params;

    const updates: Record<string, string> = {};
    if (body.status) updates.status = body.status;
    if (body.role) updates.role = body.role;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the action
    await logAuditAction(
      admin.id,
      'update_user',
      'user',
      userId,
      updates
    );

    return NextResponse.json({ user: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
