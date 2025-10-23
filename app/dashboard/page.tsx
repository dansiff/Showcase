import { Metadata } from "next";
import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";

export const metadata: Metadata = {
  title: "Dashboard - The Fusion Space Inc",
  description: "Analytics and settings dashboard",
};

export default function DashboardPage() {
  return <DashboardWrapper />;
}
