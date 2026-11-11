import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { businesses, getBusiness } from "@/data/fusionbook/seed";
import BookingExperience from "./booking-experience";

export function generateStaticParams() {
  return businesses.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusiness(slug);
  return {
    title: business ? `${business.profile.name} | FusionBook Demo` : "FusionBook Booking Demo",
    description: business ? `Book a sample appointment with ${business.profile.name}.` : "Sample appointment booking flow.",
  };
}

export default async function FusionBookBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = getBusiness(slug);
  if (!business) notFound();
  return <BookingExperience business={business} />;
}
