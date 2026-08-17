"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const deliveryConfig = { sent: { label: "Accepted", color: "var(--chart-1)" }, failed: { label: "Failed", color: "var(--chart-2)" } } satisfies ChartConfig;
const growthConfig = { users: { label: "New users", color: "var(--chart-1)" }, workspaces: { label: "New workspaces", color: "var(--chart-3)" } } satisfies ChartConfig;

export function DeliveryTrendChart({ data }: { data: Array<{ day: string; sent: number; failed: number }> }) {
  return <ChartContainer config={deliveryConfig} className="h-72 w-full"><AreaChart accessibilityLayer data={data} margin={{ left: 0, right: 8 }}><defs><linearGradient id="sentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-sent)" stopOpacity={0.35}/><stop offset="95%" stopColor="var(--color-sent)" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} /><ChartTooltip content={<ChartTooltipContent />} /><Area type="monotone" dataKey="sent" stroke="var(--color-sent)" fill="url(#sentFill)" strokeWidth={2} animationDuration={650} /><Area type="monotone" dataKey="failed" stroke="var(--color-failed)" fill="transparent" strokeWidth={2} animationDuration={750} /></AreaChart></ChartContainer>;
}

export function GrowthChart({ data }: { data: Array<{ month: string; users: number; workspaces: number }> }) {
  return <ChartContainer config={growthConfig} className="h-72 w-full"><BarChart accessibilityLayer data={data}><CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="users" fill="var(--color-users)" radius={[5,5,0,0]} animationDuration={650} /><Bar dataKey="workspaces" fill="var(--color-workspaces)" radius={[5,5,0,0]} animationDuration={750} /></BarChart></ChartContainer>;
}
