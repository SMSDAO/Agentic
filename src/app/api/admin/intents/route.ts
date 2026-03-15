import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_intent_mappings')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ intents: data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('GET /api/admin/intents error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { intentKeywords, route, featureName, description, isActive, priority, updatedBy } = body;

    if (!intentKeywords || !route || !featureName) {
      return NextResponse.json(
        { error: 'intentKeywords, route, and featureName are required' },
        { status: 400 },
      );
    }

    if (!Array.isArray(intentKeywords) || intentKeywords.length === 0) {
      return NextResponse.json(
        { error: 'intentKeywords must be a non-empty array' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_intent_mappings')
      .insert({
        intent_keywords: intentKeywords,
        route,
        feature_name: featureName,
        description: description ?? null,
        is_active: isActive ?? true,
        priority: priority ?? 0,
        updated_by: updatedBy ?? null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ intent: data }, { status: 201 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('POST /api/admin/intents error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, intentKeywords, route, featureName, description, isActive, priority, updatedBy } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (intentKeywords !== undefined) updatePayload.intent_keywords = intentKeywords;
    if (route !== undefined) updatePayload.route = route;
    if (featureName !== undefined) updatePayload.feature_name = featureName;
    if (description !== undefined) updatePayload.description = description;
    if (isActive !== undefined) updatePayload.is_active = isActive;
    if (priority !== undefined) updatePayload.priority = priority;
    if (updatedBy !== undefined) updatePayload.updated_by = updatedBy;

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_intent_mappings')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ intent: data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('PUT /api/admin/intents error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { error } = await supabase
      .from('admin_intent_mappings')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('DELETE /api/admin/intents error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
