import { Metadata } from "next";
import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";

export const metadata: Metadata = {
  title: "Dashboard - Open PROfs",
  description: "Interactive data visualization dashboard",
};

export default function DashboardPage() {
  return <DashboardWrapper />;
}
