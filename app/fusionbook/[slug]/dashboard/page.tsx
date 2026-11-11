import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBusiness, businesses } from "@/data/fusionbook/seed";
import FusionBookDashboard from "./dashboard-experience";

export const metadata: Metadata = {
  title: "FusionBook | Business Dashboard Demo",
  description: "A sample appointment and no-show reduction owner dashboard.",
};

export function generateStaticParams() {
  return businesses.map(({ slug }) => ({ slug }));
}

export default async function FusionBookDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = getBusiness(slug);
  if (!business) notFound();
  return <FusionBookDashboard business={business} />;
}
