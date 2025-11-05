"use client"

import * as React from "react"
import {
  Database,
  Folder,
  ListOrdered,
  Pizza,
} from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

// ==========================================
// DADOS DO MENU
// ==========================================
const data = {
  navMain: [
    {
      name: "Produtos",
      link: "/painel/produtos" as const,
      icon: Database,
    },
    {
      name: "Categorias",
      link: "/painel/categorias" as const,
      icon: Folder,
    },
    {
      name: "Pedidos",
      link: "/painel/pedidos" as const,
      icon: ListOrdered,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Cabeçalho */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/painel">
                <Pizza className="size-5" />
                <span className="font-semibold">Delivery</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Conteúdo principal */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.link}>
                      <item.icon className="size-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Rodapé opcional */}
      <SidebarFooter>
        <p className="text-xs text-muted-foreground px-2">
          © 2025 Delivery App
        </p>
      </SidebarFooter>

      {/* Barra de controle da sidebar */}
      <SidebarRail />
    </Sidebar>
  )
}
