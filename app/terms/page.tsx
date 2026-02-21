
export const metadata = {
  title: "Terms of Service | Website Generator",
  description: "Read the terms of service for using our website generator platform.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Service" subtitle="Please review our terms before using the platform." />
      <main className="max-w-3xl mx-auto px-4 py-16 text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms</h2>
        <p className="mb-4">By accessing or using our website generator, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you are prohibited from using or accessing this site.</p>
        <h2 className="text-2xl font-bold mb-6">2. Use License</h2>
        <p className="mb-4">Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
        <h2 className="text-2xl font-bold mb-6">3. Disclaimer</h2>
        <p className="mb-4">The materials on our site are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all other warranties.</p>
        <h2 className="text-2xl font-bold mb-6">4. Limitations</h2>
        <p className="mb-4">In no event shall the platform or its suppliers be liable for any damages arising out of the use or inability to use the materials on the site.</p>
        <h2 className="text-2xl font-bold mb-6">5. Modifications</h2>
        <p className="mb-4">We may revise these terms at any time without notice. By using this site you are agreeing to be bound by the then current version of these Terms of Service.</p>
        <h2 className="text-2xl font-bold mb-6">6. Governing Law</h2>
        <p className="mb-4">These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction.</p>
      </main>
      <PageFooter />
    </>
  );
}

import { PageHeader, PageFooter } from "@/components/PageHeaderFooter";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - The Fusion Space Inc',
  description: 'Terms and conditions for using our services.'
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Service" subtitle="Please review our terms before using the platform." />
      <main className="max-w-3xl mx-auto px-4 py-16 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-6 text-indigo-200/80">
          These terms govern your use of The Fusion Space Inc products and services. This is a simplified placeholder; a full legal version can be added upon request.
        </p>
        <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms & Use of Service</h2>
        <p className="mb-4">By accessing or using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. You agree to use the service responsibly and comply with applicable laws. If you do not agree, you are prohibited from using or accessing this site.</p>
        <h2 className="text-2xl font-bold mb-6">2. Accounts</h2>
        <p className="mb-4">You are responsible for maintaining the security of your account. Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
        <h2 className="text-2xl font-bold mb-6">3. Payments</h2>
        <p className="mb-4">All fees are billed as stated on our Pricing page or in signed proposals.</p>
        <h2 className="text-2xl font-bold mb-6">4. Content</h2>
        <p className="mb-4">You retain rights to your content; you grant us the licenses needed to operate the service.</p>
        <h2 className="text-2xl font-bold mb-6">5. Disclaimer & Liability</h2>
        <p className="mb-4">The materials on our site are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all other warranties. Service is provided as-is to the fullest extent permitted by law. In no event shall the platform or its suppliers be liable for any damages arising out of the use or inability to use the materials on the site.</p>
        <h2 className="text-2xl font-bold mb-6">6. Modifications</h2>
        <p className="mb-4">We may revise these terms at any time without notice. By using this site you are agreeing to be bound by the then current version of these Terms of Service.</p>
        <h2 className="text-2xl font-bold mb-6">7. Governing Law</h2>
        <p className="mb-4">These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction.</p>
      </main>
      <PageFooter />
    </>
  );
}
