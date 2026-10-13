import { PageHeader, PageFooter } from "@/components/PageHeaderFooter";
import LeadIntakeForm from "@/components/LeadIntakeForm";

export const metadata = {
  title: "Business Inquiry Form | Showcase",
  description: "Submit your business inquiry and let's explore how we can help grow your business.",
};

export default function LeadIntakePage() {
  return (
    <>
      <PageHeader
        theme="default"
        title="Let's Work Together"
        subtitle="Tell us about your business and how we can help"
      />
      
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-4 drop-shadow-sm">Quick Inquiry</h2>
            <p className="text-lg text-gray-700 bg-white/80 rounded-lg p-4 shadow-sm">
              We're always interested in hearing about new businesses and partnership opportunities. 
              Fill out the form below and our team will review your inquiry within 24 hours.
            </p>
          </div>

          <LeadIntakeForm sourceType="public" />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">🚀 Quick Response</h3>
              <p className="text-gray-700 text-sm text-center">Our team reviews inquiries within 24 hours and reaches out with next steps.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">💰 Flexible Options</h3>
              <p className="text-gray-700 text-sm text-center">Whether you prefer upfront investment or commission-based partnership, we have options.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">🤝 Dedicated Support</h3>
              <p className="text-gray-700 text-sm text-center">You'll have direct access to our team throughout the project and beyond.</p>
            </div>
          </div>
        </div>
      </section>

      <PageFooter theme="default" />
    </>
  );
}
