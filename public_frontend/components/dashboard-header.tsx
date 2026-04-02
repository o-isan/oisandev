"use client"

import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const pageTitles: Record<string, string> = {
  "/admin/panel": "Panel de Control",
  "/admin/panel/usuarios": "Usuarios",
  "/admin/panel/paginas": "Páginas",
  "/admin/panel/categorias": "Categorías",
  "/admin/panel/etiquetas": "Etiquetas",
  "/admin/panel/comentarios": "Comentarios"
}

export function DashboardHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Dashboard"

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </header>
  )
}
