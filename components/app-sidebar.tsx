"use client";

import * as React from "react";
import {
  ChartColumnStackedIcon,
  FolderIcon,
  ListIcon,
  SettingsIcon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const data = {
  user: {
    name: "Live Fresh",
    email: "livefresh@livefresh.live",
    avatar: "/nav-icon.jpg",
  },
  navMain: [
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: ChartColumnStackedIcon,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: ListIcon,
    },
    {
      title: "Categories",
      url: "/admin/category",
      icon: FolderIcon,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: SettingsIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <Avatar>
                  <AvatarImage src={data.user.avatar} alt={data.user.name} />
                  <AvatarFallback className="rounded-lg">LF</AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">Live Fresh</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
