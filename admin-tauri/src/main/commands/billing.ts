import { supabase, BillingPlan, Fee } from '../supabase';

// ============================================================================
// Billing Plans
// ============================================================================

export interface CreatePlanInput {
  name: string;
  display_name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  credits_included: number;
  features: string[];
  limits: Record<string, any>;
}

export async function listPlans(): Promise<BillingPlan[]> {
  const { data, error } = await supabase
    .from('billing_plans')
    .select('*')
    .order('price_monthly', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createPlan(input: CreatePlanInput): Promise<BillingPlan> {
  const { data, error } = await supabase.from('billing_plans').insert([input]).select().single();

  if (error) throw error;
  return data;
}

export async function updatePlan(
  id: string,
  updates: Partial<CreatePlanInput>
): Promise<BillingPlan> {
  const { data, error } = await supabase
    .from('billing_plans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePlan(id: string): Promise<void> {
  const { error } = await supabase.from('billing_plans').delete().eq('id', id);

  if (error) throw error;
}

// ============================================================================
// Invoices
// ============================================================================

export async function listInvoices(filters?: {
  userId?: string;
  status?: string;
}): Promise<any[]> {
  let query = supabase
    .from('billing_invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function refundPayment(invoiceId: string): Promise<void> {
  // Mark invoice as refunded
  const { error: invoiceError } = await supabase
    .from('billing_invoices')
    .update({ status: 'refunded' })
    .eq('id', invoiceId);

  if (invoiceError) throw invoiceError;

  // Mark associated payment as refunded
  const { error: paymentError } = await supabase
    .from('billing_payments')
    .update({ status: 'refunded' })
    .eq('invoice_id', invoiceId);

  if (paymentError) throw paymentError;
}

// ============================================================================
// Stripe Integration
// ============================================================================

export interface CreateStripeCheckoutInput {
  userId: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly';
}

export async function createStripeCheckout(
  input: CreateStripeCheckoutInput
): Promise<{ url: string }> {
  // TODO: Implement Stripe checkout session creation
  // This would typically call a Stripe API
  return {
    url: 'https://checkout.stripe.com/example',
  };
}

// ============================================================================
// Crypto Payments
// ============================================================================

export interface CreateCryptoPaymentInput {
  userId: string;
  amount: number;
  currency: 'SOL' | 'USDC';
}

export async function createCryptoPaymentRequest(
  input: CreateCryptoPaymentInput
): Promise<{
  walletAddress: string;
  amount: number;
  currency: string;
  expiresAt: string;
}> {
  // TODO: Implement crypto payment request
  // This would generate a unique wallet address or payment link
  return {
    walletAddress: 'EXAMPLE_WALLET_ADDRESS',
    amount: input.amount,
    currency: input.currency,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
  };
}

export async function verifyCryptoPayment(transactionSignature: string): Promise<boolean> {
  // TODO: Implement crypto payment verification
  // This would verify the transaction on the blockchain
  return true;
}
