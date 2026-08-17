"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const config = { accepted: { label: "Accepted", color: "var(--chart-1)" }, failed: { label: "Failed", color: "var(--destructive)" } } satisfies ChartConfig;

export function DeliveryChart({ data }: { data: { date: string; accepted: number; failed: number }[] }) {
  return <ChartContainer config={config} className="h-[300px] w-full">
    <AreaChart accessibilityLayer data={data} margin={{ left: -20, right: 8, top: 12 }}>
      <defs><linearGradient id="acceptedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-accepted)" stopOpacity={0.35}/><stop offset="95%" stopColor="var(--color-accepted)" stopOpacity={0.02}/></linearGradient></defs>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={20} />
      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
      <Area type="monotone" dataKey="accepted" stroke="var(--color-accepted)" fill="url(#acceptedFill)" strokeWidth={2.5} animationDuration={700} />
      <Area type="monotone" dataKey="failed" stroke="var(--color-failed)" fill="transparent" strokeWidth={2} animationDuration={700} />
    </AreaChart>
  </ChartContainer>;
}
