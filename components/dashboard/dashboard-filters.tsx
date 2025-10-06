"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default function DashboardFilters() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="flex flex-wrap gap-4 items-center">
     <Select
  options={[
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" }
  ]}
  value={{ label: "Last 30 days", value: "30d" }}
  onChange={(opt) => setTimeRange(opt.value)}
  placeholder="Select time range"
/>

      <Button>Apply Filters</Button>
    </div>
  );
}
