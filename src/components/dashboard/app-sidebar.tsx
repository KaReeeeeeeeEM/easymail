"use client";

import { BookOpen, KeyRound, LayoutDashboard, Settings, Send } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API keys", icon: KeyRound },
  { href: "/dashboard/sender", label: "SMTP senders", icon: Send },
  { href: "/docs", label: "Documentation", icon: BookOpen },
];

export function AppSidebar({ email }: { email: string }) {
  return <Sidebar><SidebarHeader className="p-5"><Logo /></SidebarHeader><SidebarContent><SidebarGroup><SidebarGroupLabel>Workspace</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{items.map(({ href, label, icon: Icon }) => <SidebarMenuItem key={href}><SidebarMenuButton render={<Link href={href} />}><Icon /><span>{label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent><SidebarFooter><SidebarMenu><SidebarMenuItem><SidebarMenuButton render={<Link href="/dashboard/settings" />}><Settings /><span className="truncate">{email}</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarFooter></Sidebar>;
}
