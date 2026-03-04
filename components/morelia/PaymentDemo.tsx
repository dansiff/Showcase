"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const plans = [
  { name: 'Basic', price: 10, features: ['Access to basic content'] },
  { name: 'Pro', price: 25, features: ['Basic + premium content', 'Priority support'] },
  { name: 'Premium', price: 50, features: ['All Pro features', 'Exclusive events', '1:1 creator chat'] },
];

export default function PaymentDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const [paid, setPaid] = useState(false);

  const handleCheckout = () => {
    // Simulate payment
    setTimeout(() => setPaid(true), 800);
  };

  if (paid && selected !== null) {
    return (
      <div className="p-6 rounded-lg bg-green-50 text-green-800 shadow">
        <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
        <p>You are now subscribed to the <span className="font-semibold">{plans[selected].name}</span> plan.</p>
        <p className="mt-2">Check your email for confirmation and next steps.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Subscribe to a Plan</h2>
      <div className="space-y-4">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={cn(
              'border rounded-lg p-4 cursor-pointer transition',
              selected === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            )}
            onClick={() => setSelected(idx)}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{plan.name}</span>
              <span className="text-blue-600 font-bold">${plan.price}/mo</span>
            </div>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {plan.features.map(f => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <button
        className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={selected === null}
        onClick={handleCheckout}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
