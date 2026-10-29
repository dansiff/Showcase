import type { Metadata } from "next";
import BusinessDataStudio from "@/components/business-data/BusinessDataStudio";

export const metadata: Metadata = {
  title: "Business Data Studio | The Fusion Space",
  description:
    "Interactive previews of practical business software: bookkeeping, invoices, inventory, and the SQL data models behind them.",
};

export default function BusinessDataPage() {
  return <BusinessDataStudio />;
}