import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/client';
import { requireAdmin, logAuditAction } from '@/lib/supabase/auth';

// Valid enum values
const VALID_ROLES = ['user', 'admin', 'super_admin'] as const;
const VALID_STATUSES = ['active', 'suspended', 'banned'] as const;

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
    
    // Validate and add status if provided
    if (body.status) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }
    
    // Validate and add role if provided
    if (body.role) {
      if (!VALID_ROLES.includes(body.role)) {
        return NextResponse.json(
          { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
          { status: 400 }
        );
      }
      updates.role = body.role;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update user:', error);
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
    if (error instanceof Error) {
      console.error('Error in user update:', error);
      // Check if it's an authorization error
      if (error.message.includes('required') || error.message.includes('access')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      // Other errors are server errors
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
