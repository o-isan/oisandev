import type React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { RefreshSession } from "@/components/RefreshSession";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const refresh = cookieStore.get("refresh_token")?.value;

  // 🔐 Si no hay refresh token → fuera
  if (!refresh) {
    redirect("/admin/login");
  }

  // ✅ Renderizamos SIEMPRE el panel
  // y dejamos que RefreshSession valide access/refresh
  return (
    <RefreshSession>
      <div className="min-h-screen bg-background">
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </div>
    </RefreshSession>
  );
}
