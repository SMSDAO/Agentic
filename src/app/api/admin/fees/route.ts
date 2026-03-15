import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_fee_config')
      .select('*')
      .order('fee_type');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ fees: data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('GET /api/admin/fees error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { feeType, amountSol, reserveAddress, autoForward, isActive, updatedBy } = body;

    if (!feeType || amountSol === undefined) {
      return NextResponse.json(
        { error: 'feeType and amountSol are required' },
        { status: 400 },
      );
    }

    if (typeof amountSol !== 'number' || amountSol < 0) {
      return NextResponse.json(
        { error: 'amountSol must be a non-negative number' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();

    // Fetch current value for audit log
    const { data: current } = await supabase
      .from('admin_fee_config')
      .select('amount_sol')
      .eq('fee_type', feeType)
      .single();

    const updatePayload: Record<string, unknown> = {
      amount_sol: amountSol,
      updated_at: new Date().toISOString(),
    };
    if (reserveAddress !== undefined) updatePayload.reserve_address = reserveAddress;
    if (autoForward !== undefined) updatePayload.auto_forward = autoForward;
    if (isActive !== undefined) updatePayload.is_active = isActive;
    if (updatedBy !== undefined) updatePayload.updated_by = updatedBy;

    const { data, error } = await supabase
      .from('admin_fee_config')
      .update(updatePayload)
      .eq('fee_type', feeType)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Write audit log entry
    await supabase.from('admin_fee_audit_log').insert({
      fee_type: feeType,
      old_value: current?.amount_sol ?? null,
      new_value: amountSol,
      changed_by: updatedBy ?? null,
    });

    return NextResponse.json({ fee: data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('PUT /api/admin/fees error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
