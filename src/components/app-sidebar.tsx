"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

import {
  LayoutDashboard,
  Stethoscope,
  Video,
  Share2,
  ScanFace,
  BookUser,
  HeartPulse,
  Settings,
} from "lucide-react"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/diagnosis", label: "AI Diagnosis", icon: Stethoscope },
  { href: "/tele-consultation", label: "Tele-Consultation", icon: Video },
  { href: "/federated-learning", label: "Federated Learning", icon: Share2 },
  { href: "/facial-recognition", label: "Facial Check-in", icon: ScanFace },
  { href: "/abdm-integration", label: "ABDM Integration", icon: BookUser },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="bg-primary/20 text-primary hover:bg-primary/30" asChild>
            <Link href="/dashboard">
              <HeartPulse />
            </Link>
          </Button>
          <h2 className="font-headline text-lg font-semibold text-primary">
            Swasthya Sahayak
          </h2>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{ children: item.label, side: "right" }}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{children: 'Settings', side: 'right'}}>
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
