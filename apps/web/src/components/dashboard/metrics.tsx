"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type MetricPoint = {
  name: string;
  total: number;
};

export const DashboardMetrics = ({
  byClient,
  byMonth,
  byYear,
}: {
  byClient: MetricPoint[];
  byMonth: MetricPoint[];
  byYear: MetricPoint[];
}) => (
  <div className="grid gap-4 lg:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Earnings by client</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byClient}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="total" fill="#0f172a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Earnings by month</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byMonth}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Earnings by year</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byYear}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);
