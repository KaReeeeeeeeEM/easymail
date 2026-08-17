"use client";

import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const config = { accepted: { label: "Accepted", color: "var(--chart-1)" }, failed: { label: "Failed", color: "var(--destructive)" }, pending: { label: "Pending", color: "var(--muted-foreground)" } } satisfies ChartConfig;

export function StatusChart({ accepted, failed, pending }: { accepted: number; failed: number; pending: number }) {
  const data = [{ status: "accepted", value: accepted }, { status: "failed", value: failed }, { status: "pending", value: pending }];
  return <ChartContainer config={config} className="mx-auto h-[300px] w-full"><PieChart accessibilityLayer><ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} /><Pie data={data} dataKey="value" nameKey="status" innerRadius={62} outerRadius={96} paddingAngle={3}>{data.map((item) => <Cell key={item.status} fill={`var(--color-${item.status})`} />)}</Pie><ChartLegend content={<ChartLegendContent nameKey="status" />} /></PieChart></ChartContainer>;
}
