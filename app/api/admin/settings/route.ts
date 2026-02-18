import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/client';
import { requireAdmin, logAuditAction } from '@/lib/supabase/auth';

export async function GET() {
  try {
    await requireAdmin();

    const supabase = createSupabaseAdmin();

    // Get platform settings
    const { data: settings, error } = await supabase
      .from('platform_settings')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settingsMap = (settings || []).reduce((acc: any, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    return NextResponse.json(settingsMap);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const supabase = createSupabaseAdmin();
    const body = await request.json();

    // Update maintenance mode
    if (body.maintenance_mode !== undefined) {
      await supabase
        .from('platform_settings')
        .upsert({
          key: 'maintenance_mode',
          value: { enabled: body.maintenance_mode },
          description: 'Platform maintenance mode flag',
        });
    }

    // Update feature flags
    if (body.feature_flags) {
      await supabase
        .from('platform_settings')
        .upsert({
          key: 'feature_flags',
          value: body.feature_flags,
          description: 'Feature availability flags',
        });
    }

    // Log the action
    await logAuditAction(
      admin.id,
      'update_settings',
      'settings',
      undefined,
      body
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
