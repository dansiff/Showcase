"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface ChartCardProps {
  type: "line" | "bar" | "pie";
  title: string;
  data?: { name: string; value: number }[];
  colors?: string[];
  isLoading?: boolean;
  error?: string;
}

const defaultData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
];
const sampleData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
];


const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28"];
const defaultColors = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28"];
export default function ChartCard({
  type,
  title,
  data = defaultData,
  colors = defaultColors,
  isLoading = false,
  error,
}: ChartCardProps) {

  if (isLoading) {
    return (
      <Card className="shadow-lg rounded-2xl">
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <span className="text-sm text-gray-500">Loading chart data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg rounded-2xl border-red-400">
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <span className="text-sm text-red-500">Error: {error}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
       <ResponsiveContainer width="100%" height="100%">
  {type === "line" ? (
    <LineChart data={sampleData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#FF8042" strokeWidth={3} />
    </LineChart>
  ) : type === "bar" ? (
    <BarChart data={sampleData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#0088FE" radius={[6, 6, 0, 0]} />
    </BarChart>
  ) : (
    <PieChart>
      <Pie
        data={sampleData}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {sampleData.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  )}
</ResponsiveContainer>

      </CardContent>
    </Card>
  );
}
