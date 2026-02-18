import { createSupabaseClient, createSupabaseAdmin } from './client';
import { User } from './client';

export interface AuthUser extends User {
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'banned';
  full_name?: string;
  avatar_url?: string;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, userData?: {
  full_name?: string;
  wallet_address?: string;
}) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = createSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = createSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

/**
 * Get current user with role and status
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = createSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Fetch user details from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    return null;
  }

  return userData as AuthUser;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  if (user.status === 'suspended' || user.status === 'banned') {
    throw new Error('Account is suspended or banned');
  }

  return user;
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role !== 'admin' && user.role !== 'super_admin') {
    throw new Error('Admin access required');
  }

  return user;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getUser();
    return user?.role === 'admin' || user?.role === 'super_admin';
  } catch {
    return false;
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  userId: string,
  role: 'user' | 'admin' | 'super_admin'
) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update user status (admin only)
 */
export async function updateUserStatus(
  userId: string,
  status: 'active' | 'suspended' | 'banned'
) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
    .update({ status })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Log admin action to audit log
 */
export async function logAuditAction(
  userId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('audit_log').insert({
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  if (error) {
    console.error('Failed to log audit action:', error);
  }
}

/**
 * Sign in with Solana wallet
 */
export async function signInWithWallet(
  walletAddress: string,
  signature: string,
  message: string
): Promise<AuthUser | null> {
  // Verify signature (implementation depends on wallet adapter)
  // For now, we'll use the admin client to find or create user
  const supabase = createSupabaseAdmin();

  // Check if user exists with this wallet
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (existingUser) {
    return existingUser as AuthUser;
  }

  // Create new user with wallet
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      email: `${walletAddress}@wallet.local`,
      wallet_address: walletAddress,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return newUser as AuthUser;
}

/**
 * Create notification for user
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  actionUrl?: string
) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title,
    message,
    type,
    action_url: actionUrl,
  });

  if (error) {
    console.error('Failed to create notification:', error);
  }
}
