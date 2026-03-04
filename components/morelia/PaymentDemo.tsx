"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const plans = [
  { name: "Basic", price: 10, features: ["Access to basic content"] },
  { name: "Pro", price: 25, features: ["Basic + premium content", "Priority support"] },
  { name: "Premium", price: 50, features: ["All Pro features", "Exclusive events", "1:1 creator chat"] },
];

export default function PaymentDemo() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [paid, setPaid] = useState(false);
  const [redirectToPrint, setRedirectToPrint] = useState(false);

  // Simulate payment
  const handleCheckout = () => {
    setTimeout(() => {
      setPaid(true);
      if (contactMethod === "print") {
        setTimeout(() => setRedirectToPrint(true), 1200);
      }
    }, 800);
  };

  // Step 0: Onboarding (name)
  if (step === 0) {
    return (
      <div className="max-w-lg mx-auto p-8 rounded-3xl shadow-lg bg-gradient-to-br from-indigo-950/80 to-blue-900/80 border border-indigo-700/30 text-white">
        <h2 className="text-3xl font-bold mb-4 text-center">Get Started</h2>
        <p className="mb-6 text-indigo-200 text-center">Welcome! Enter your name to begin onboarding.</p>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-indigo-900/60 border border-indigo-700 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          className={cn(
            "w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50",
            !name && "cursor-not-allowed"
          )}
          disabled={!name}
          onClick={() => setStep(1)}
        >
          Next: Contact Method
        </button>
      </div>
    );
  }

  // Step 1: Choose contact method
  if (step === 1) {
    return (
      <div className="max-w-lg mx-auto p-8 rounded-3xl shadow-lg bg-gradient-to-br from-indigo-950/80 to-blue-900/80 border border-indigo-700/30 text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">How should we send your receipt?</h2>
        <div className="flex flex-col gap-4 mb-6">
          <button
            className={cn(
              "w-full py-3 rounded-xl font-semibold border border-indigo-700 bg-indigo-900/60 hover:bg-indigo-800 transition",
              contactMethod === "email" && "ring-2 ring-blue-400"
            )}
            onClick={() => setContactMethod("email")}
          >
            Email
          </button>
          <button
            className={cn(
              "w-full py-3 rounded-xl font-semibold border border-indigo-700 bg-indigo-900/60 hover:bg-indigo-800 transition",
              contactMethod === "print" && "ring-2 ring-blue-400"
            )}
            onClick={() => setContactMethod("print")}
          >
            Print/Download
          </button>
        </div>
        {contactMethod === "email" && (
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl bg-indigo-900/60 border border-indigo-700 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
            placeholder="Your Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        )}
        <button
          className={cn(
            "w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50",
            (!contactMethod || (contactMethod === "email" && !email)) && "cursor-not-allowed"
          )}
          disabled={!contactMethod || (contactMethod === "email" && !email)}
          onClick={() => setStep(2)}
        >
          Next: Choose Plan
        </button>
      </div>
    );
  }

  // Step 2: Choose plan
  if (step === 2) {
    return (
      <div className="max-w-lg mx-auto p-8 rounded-3xl shadow-lg bg-gradient-to-br from-indigo-950/80 to-blue-900/80 border border-indigo-700/30 text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Select a Subscription Plan</h2>
        <div className="space-y-4 mb-6">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={cn(
                "border rounded-xl p-4 cursor-pointer transition",
                selected === idx ? "border-blue-500 bg-blue-950/40" : "border-indigo-800 bg-indigo-900/40"
              )}
              onClick={() => setSelected(idx)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-blue-200">{plan.name}</span>
                <span className="text-blue-400 font-bold">${plan.price}/mo</span>
              </div>
              <ul className="mt-2 text-sm text-indigo-200 list-disc list-inside">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <button
          className={cn(
            "w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50",
            selected === null && "cursor-not-allowed"
          )}
          disabled={selected === null}
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    );
  }

  // Step 3: Payment result
  if (paid && selected !== null) {
    if (redirectToPrint) {
      // Simulate redirect to print page
      window.location.href = `/receipt?plan=${plans[selected].name}&name=${encodeURIComponent(name)}`;
      return null;
    }
    return (
      <div className="max-w-lg mx-auto p-8 rounded-3xl shadow-lg bg-gradient-to-br from-green-900/80 to-green-700/80 border border-green-700/30 text-green-100 text-center">
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="mb-2">Thank you, <span className="font-semibold">{name}</span>!</p>
        <p className="mb-2">You are now subscribed to the <span className="font-semibold">{plans[selected].name}</span> plan.</p>
        {contactMethod === "email" ? (
          <p className="mt-2">A receipt and onboarding details will be sent to <span className="font-semibold">{email}</span>.</p>
        ) : (
          <p className="mt-2">Redirecting to your printable receipt...</p>
        )}
      </div>
    );
  }

  // Default fallback
  return null;
}
