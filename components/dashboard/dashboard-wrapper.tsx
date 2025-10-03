"use client";

import { motion } from "framer-motion";
import ChartCard from "./chart-card";
import DashboardFilters from "./dashboard-filters";
import DataTable from "./data-table";

export default function DashboardWrapper() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      <DashboardFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard type="line" title="Monthly Sales" />
        <ChartCard type="bar" title="Product Performance" />
        <ChartCard type="pie" title="Customer Segments" />
      </div>

      <DataTable />
    </motion.div>
  );
}
