"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, FileText, FolderTree, Tags, LayoutDashboard, LogOut, MessageSquare } from "lucide-react"
import { clearAuthCookies } from "@/actions/auth"
import { useRouter } from 'next/navigation'
import { Button } from "./ui/button"

const navigation = [
  { name: "Panel", href: "/admin/panel", icon: LayoutDashboard },
  { name: "Usuarios", href: "/admin/panel/usuarios", icon: Users },
  { name: "Páginas", href: "/admin/panel/paginas", icon: FileText },
  { name: "Categorías", href: "/admin/panel/categorias", icon: FolderTree },
  { name: "Etiquetas", href: "/admin/panel/etiquetas", icon: Tags },
  { name: "Comentarios", href: "/admin/panel/comentarios", icon: MessageSquare },

]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()


  const handleClick = async () => {
    await clearAuthCookies();
    router.push('/admin/login')
  }


  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
            <span className="text-sm font-bold">{"</>"}</span>
          </div>
          <h1 className="text-lg font-bold text-sidebar-foreground">Admin Panel</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <span
          onClick={handleClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </span>
      </div>
    </aside>
  )
}
