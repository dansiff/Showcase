"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardFilters() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select onValueChange={setTimeRange} defaultValue="30d">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
        </SelectContent>
      </Select>

      <Button>Apply Filters</Button>
    </div>
  );
}
