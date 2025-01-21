import vendorIcon from "@/img/whetstone_inventory_icon.png";
import waystoneIcon from "@/img/waystone_inventory_icon.png";
import tabletIcon from "@/img/precursortablet_inventory_icon.png";

import {
  Code,
  Github,
  Bug,
  Coffee,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Vendor",
    url: "/vendor",
    icon: vendorIcon,
  },
  {
    title: "Waystones",
    url: "/waystone",
    icon: waystoneIcon,
  },
  {
    title: "Tablets",
    url: "/tablet",
    icon: tabletIcon,
  },
]

export function Menu() {
  const pathname = window.location.pathname;
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
          </SidebarMenu>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <img src={item.icon} alt={item.title} width="32" height="32"/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>Improvements</SidebarGroupLabel>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="https://github.com/veiset/poe2.re/issues/new?assignees=veiset&labels=enhancement&projects=&template=feature_request.md&title=Feature%3A+%3CTitle%3E" target="_blank">
                  <Github/>
                  <span>Feature request</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="https://github.com/veiset/poe2.re/issues/new?assignees=veiset&labels=bug&projects=&template=bug_report.md&title=Bug%3A+%3CTitle%3E" target="_blank">
                  <Bug/>
                  <span>Bug report</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="https://github.com/veiset/poe2.re" target="_blank">
                  <Code/>
                  <span>Source code</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>Help out</SidebarGroupLabel>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="https://buymeacoffee.com/veiset" target="_blank">
                  <Coffee />
                  <span>Buy me a coffee</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}