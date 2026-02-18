import { supabase, Addon } from '../supabase';

export async function listAddons(): Promise<Addon[]> {
  const { data, error } = await supabase.from('addons').select('*').order('name');

  if (error) throw error;
  return data || [];
}

export async function installAddon(addonId: string): Promise<Addon> {
  const { data, error } = await supabase
    .from('addons')
    .update({ installed: true })
    .eq('id', addonId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uninstallAddon(addonId: string): Promise<Addon> {
  const { data, error } = await supabase
    .from('addons')
    .update({ installed: false })
    .eq('id', addonId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function enableAddon(addonId: string): Promise<Addon> {
  const { data, error } = await supabase
    .from('addons')
    .update({ enabled: true })
    .eq('id', addonId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function disableAddon(addonId: string): Promise<Addon> {
  const { data, error } = await supabase
    .from('addons')
    .update({ enabled: false })
    .eq('id', addonId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function configureAddon(
  addonId: string,
  userId: string,
  config: Record<string, any>
): Promise<void> {
  const { error } = await supabase.from('addon_configs').upsert([
    {
      addon_id: addonId,
      user_id: userId,
      config,
      enabled: true,
    },
  ]);

  if (error) throw error;
}

export async function getAddonConfig(addonId: string, userId?: string): Promise<any> {
  let query = supabase.from('addon_configs').select('*').eq('addon_id', addonId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
