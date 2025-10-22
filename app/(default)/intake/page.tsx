export const metadata = {
  title: "Client Intake Form — Showcase",
  description: "Start your project with us. Professional website development services.",
};

import ClientIntakeForm from "./ClientIntakeForm";

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let's Build Something Amazing
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Professional Website Development Services
          </p>
          <p className="text-gray-500">
            Fill out the form below to get started. A 50% deposit secures your project slot.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">48hrs</div>
              <div className="text-sm text-gray-600">Initial Response</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">100+</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">4.9★</div>
              <div className="text-sm text-gray-600">Client Rating</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <ClientIntakeForm />

        {/* FAQ Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why 50% upfront?</h3>
              <p className="text-gray-600">
                The deposit secures your project timeline and allows us to begin work immediately. 
                The remaining 50% is due upon project completion.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens after I submit?</h3>
              <p className="text-gray-600">
                You'll receive a confirmation email within 24 hours, followed by a kickoff call 
                to discuss your project in detail.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How long does development take?</h3>
              <p className="text-gray-600">
                Typical projects take 2-6 weeks depending on complexity. We'll provide a detailed 
                timeline during your kickoff call.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
