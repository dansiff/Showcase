"use client";

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function GetStartedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: 'restaurant',
    website: '',
    plan: 'professional',
    message: '',
    trial: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Integrate with actual backend/API
    // For now, simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You! 🎉</h2>
        <p className="text-lg text-gray-600 mb-6">
          We've received your request and will contact you within 24 hours to discuss your project.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            Check your email at <strong>{formData.email}</strong> for next steps and your free trial activation link.
          </p>
        </div>
        <button
          onClick={() => { setIsSubmitted(false); setFormData({ ...formData, name: '', email: '', phone: '', message: '' }); }}
          className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div id="form" className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your Free Trial</h2>
        <p className="text-gray-600">Fill out the form below and we'll get started on your website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            required
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Your Business LLC"
          />
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="businessType" className="block text-sm font-semibold text-gray-700 mb-2">
            Business Type *
          </label>
          <select
            id="businessType"
            name="businessType"
            required
            value={formData.businessType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="restaurant">Restaurant / Food Service</option>
            <option value="retail">Retail / E-commerce</option>
            <option value="service">Professional Service</option>
            <option value="healthcare">Healthcare / Medical</option>
            <option value="beauty">Beauty / Salon</option>
            <option value="fitness">Fitness / Gym</option>
            <option value="real-estate">Real Estate</option>
            <option value="construction">Construction / Trades</option>
            <option value="nonprofit">Non-Profit</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Existing Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
            Current Website (if any)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="https://example.com"
          />
        </div>

        {/* Plan Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Choose Your Plan *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'starter', label: 'Starter', price: '$297' },
              { value: 'professional', label: 'Professional', price: '$697', popular: true },
              { value: 'enterprise', label: 'Enterprise', price: 'Custom' },
            ].map((plan) => (
              <label
                key={plan.value}
                className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.plan === plan.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                } ${plan.popular ? 'ring-2 ring-orange-400' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                )}
                <input
                  type="radio"
                  name="plan"
                  value={plan.value}
                  checked={formData.plan === plan.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="font-bold text-gray-900">{plan.label}</div>
                <div className="text-sm text-indigo-600 font-semibold">{plan.price}</div>
              </label>
            ))}
          </div>
        </div>

        {/* Free Trial Checkbox */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="trial"
              checked={formData.trial}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-green-600 border-green-300 rounded focus:ring-green-500"
            />
            <div>
              <div className="font-semibold text-gray-900">Start with 14-Day Free Trial</div>
              <div className="text-sm text-gray-600">Test your website risk-free. No credit card required.</div>
            </div>
          </label>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
            Tell us about your project
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            placeholder="What features do you need? Any specific design preferences? Timeline?"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {formData.trial ? 'Start Free Trial' : 'Get Started'}
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to our Terms of Service and Privacy Policy. 
          We'll contact you within 24 hours.
        </p>
      </form>
    </div>
  );
}
