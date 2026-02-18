import React, { useEffect, useState } from 'react';
import { listPlans } from '../../../main/commands/billing';
import type { BillingPlan } from '../../../main/supabase';

const BillingScreen: React.FC = () => {
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await listPlans();
      setPlans(data);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading billing plans...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Billing</h1>
        <p className="text-gray-400 mt-2">Manage subscription plans and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="card">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">{plan.display_name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">${plan.price_monthly}</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mt-4">{plan.description}</p>
              <div className="mt-6 space-y-2">
                {(plan.features as string[]).map((feature, index) => (
                  <div key={index} className="text-sm text-gray-300">
                    ✓ {feature}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <span
                  className={`badge ${plan.active ? 'badge-success' : 'badge-danger'}`}
                >
                  {plan.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingScreen;
