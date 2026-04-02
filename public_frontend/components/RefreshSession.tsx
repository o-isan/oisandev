"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function RefreshSession({ children }: { children?: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
        })

        if (!res.ok) {
          router.replace("/admin/login")
          return
        }

        // 🔥 Volvemos a la ruta actual
        router.replace(pathname)

      } catch {
        router.replace("/admin/login")
      }
    }

    refreshSession()
  }, [pathname, router])

  return <>{children}</>
}
