import { cookies } from "next/headers"

const API_URL = process.env.API_URL!

export async function ensureValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const refresh = cookieStore.get("refresh_token")?.value
  if (!refresh) return null

  const res = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  })

  if (!res.ok) return null

  const data = await res.json()

  cookieStore.set("access_token", data.access, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  })

  return data.access
}
