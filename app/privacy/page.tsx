import { PageHeader, PageFooter } from "@/components/PageHeaderFooter";

export const metadata = {
  title: "Privacy Policy | Website Generator",
  description: "Read our privacy policy to understand how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" subtitle="Your privacy is important to us." />
      <main className="max-w-3xl mx-auto px-4 py-16 text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-bold mb-6">1. Information We Collect</h2>
        <p className="mb-4">We collect information you provide directly, such as when you create an account, use our generator, or contact support. This may include your name, email, and business details.</p>
        <h2 className="text-2xl font-bold mb-6">2. How We Use Information</h2>
        <p className="mb-4">We use your information to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.</p>
        <h2 className="text-2xl font-bold mb-6">3. Data Sharing</h2>
        <p className="mb-4">We do not sell your personal information. We may share data with trusted service providers as needed to operate our platform (e.g., payment processing, hosting).</p>
        <h2 className="text-2xl font-bold mb-6">4. Security</h2>
        <p className="mb-4">We implement reasonable security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
        <h2 className="text-2xl font-bold mb-6">5. Your Rights</h2>
        <p className="mb-4">You may request access to, correction of, or deletion of your personal information by contacting us. Some data may be retained as required by law.</p>
        <h2 className="text-2xl font-bold mb-6">6. Changes to This Policy</h2>
        <p className="mb-4">We may update this Privacy Policy from time to time. We encourage you to review it regularly.</p>
      </main>
      <PageFooter />
    </>
  );
}
