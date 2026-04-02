import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { RefreshSession } from "@/components/RefreshSession";

const API_URL = process.env.API_URL!;

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;
  const refresh = cookieStore.get("refresh_token")?.value;

  // 1️⃣ Access válido → fuera del login
  if (access) {
    const res = await fetch(`${API_URL}/auth/user/`, {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    });

    if (res.ok) {
      redirect("/admin/panel");
    }
  }

  return (
    <>
      {refresh && <RefreshSession />}
      {children}
    </>
  );
}
