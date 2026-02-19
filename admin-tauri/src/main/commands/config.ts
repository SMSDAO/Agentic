import { supabase, PlatformSetting } from '../supabase';

export async function getPlatformSettings(): Promise<PlatformSetting[]> {
  const { data, error } = await supabase.from('platform_settings').select('*');

  if (error) throw error;
  return data || [];
}

export async function getSetting(key: string): Promise<PlatformSetting> {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('*')
    .eq('setting_key', key)
    .single();

  if (error) throw error;
  return data;
}

export async function updateSetting(
  key: string,
  value: any,
  updatedBy?: string
): Promise<PlatformSetting> {
  const { data, error } = await supabase
    .from('platform_settings')
    .update({
      setting_value: value,
      updated_by: updatedBy,
    })
    .eq('setting_key', key)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createSetting(input: {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic?: boolean;
}): Promise<PlatformSetting> {
  const { data, error } = await supabase
    .from('platform_settings')
    .insert([
      {
        setting_key: input.key,
        setting_value: input.value,
        setting_type: input.type,
        description: input.description,
        is_public: input.isPublic || false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
