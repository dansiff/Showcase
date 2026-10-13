"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface LeadIntakeFormProps {
  sourceType?: "internal" | "public";
  onSuccess?: (leadId: string) => void;
}

export default function LeadIntakeForm({ sourceType = "public", onSuccess }: LeadIntakeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    businessType: "",
    revenueModel: "",
    paymentProcessorStatus: "",
    monthlyRevenueEstimate: "",
    commissionInterested: false,
    timeline: "",
    budget: "",
    additionalNotes: "",
    termsAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!formData.fullName || !formData.email || !formData.company) {
        throw new Error("Name, email, and company are required");
      }

      if (!formData.termsAccepted) {
        throw new Error("Please accept the terms and conditions");
      }

      const payload = {
        ...formData,
        projectType: "b2b-lead",
        referralSource: sourceType === "internal" ? "internal-team" : "public",
      };

      const response = await fetch("/api/lead-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        website: "",
        businessType: "",
        revenueModel: "",
        paymentProcessorStatus: "",
        monthlyRevenueEstimate: "",
        commissionInterested: false,
        timeline: "",
        budget: "",
        additionalNotes: "",
        termsAccepted: false,
      });

      if (onSuccess) {
        onSuccess(data.leadId);
      }

      // Auto-hide success message after 5s
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900">Business Inquiry Form</h2>
      <p className="text-gray-600">Tell us about your business and how we can help</p>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">✓ Thank you! We'll be in touch shortly.</p>
        </div>
      )}

      {/* Contact Information */}
      <fieldset className="space-y-4 border-b pb-6">
        <legend className="text-lg font-semibold text-gray-900">Contact Information</legend>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name *"
            value={formData.company}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
            required
          />
        </div>

        <input
          type="url"
          name="website"
          placeholder="Website (optional)"
          value={formData.website}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
        />
      </fieldset>

      {/* Business Details */}
      <fieldset className="space-y-4 border-b pb-6">
        <legend className="text-lg font-semibold text-gray-900">Business Details</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
          >
            <option value="">Select Business Type</option>
            <option value="restaurant">Restaurant / Food Service</option>
            <option value="retail">Retail</option>
            <option value="services">Services</option>
            <option value="saas">SaaS / Software</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="other">Other</option>
          </select>

          <select
            name="revenueModel"
            value={formData.revenueModel}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
          >
            <option value="">Select Revenue Model</option>
            <option value="subscription">Subscription</option>
            <option value="commission">Commission-Based</option>
            <option value="one-time">One-Time Payments</option>
            <option value="hybrid">Hybrid</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="monthlyRevenueEstimate"
            value={formData.monthlyRevenueEstimate}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
          >
            <option value="">Monthly Revenue Estimate</option>
            <option value="under-1k">Under $1,000</option>
            <option value="1k-5k">$1,000 - $5,000</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-50k">$10,000 - $50,000</option>
            <option value="50k-plus">$50,000+</option>
          </select>

          <select
            name="paymentProcessorStatus"
            value={formData.paymentProcessorStatus}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
          >
            <option value="">Payment Processor Status</option>
            <option value="has-processor">Already using a processor</option>
            <option value="looking-for-processor">Looking for a processor</option>
            <option value="unsure">Not sure / No payments yet</option>
          </select>
        </div>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="commissionInterested"
            checked={formData.commissionInterested}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-600 bg-white border border-gray-400 rounded focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
          <span className="text-gray-900 font-medium">Interested in commission-only partnership</span>
        </label>
      </fieldset>

      {/* Timeline & Budget */}
      <fieldset className="space-y-4 border-b pb-6">
        <legend className="text-lg font-semibold text-gray-900">Timeline & Budget</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
          >
            <option value="">When do you need this?</option>
            <option value="asap">ASAP</option>
            <option value="1-month">Within 1 month</option>
            <option value="2-3-months">2-3 months</option>
            <option value="flexible">Flexible</option>
          </select>

          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
          >
            <option value="">Budget Range</option>
            <option value="under-5k">Under $5,000</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-50k">$25,000 - $50,000</option>
            <option value="50k-plus">$50,000+</option>
            <option value="commission-only">Commission-Only</option>
          </select>
        </div>
      </fieldset>

      {/* Additional Notes */}
      <fieldset className="space-y-4 border-b pb-6">
        <legend className="text-lg font-semibold text-gray-900">Additional Information</legend>
        
        <textarea
          name="additionalNotes"
          placeholder="Tell us more about your project, goals, or any specific needs..."
          value={formData.additionalNotes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
        />
      </fieldset>

      {/* Terms */}
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
          className="w-4 h-4 accent-blue-600 bg-white border border-gray-400 rounded focus:ring-2 focus:ring-blue-600 focus:border-blue-600 mt-1"
          required
        />
        <span className="text-sm text-gray-900 font-medium">
          I agree to be contacted about my inquiry and accept the terms and conditions *
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-semibold text-white transition shadow-md text-lg",
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        )}
      >
        {loading ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
