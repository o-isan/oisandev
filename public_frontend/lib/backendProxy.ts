import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.API_URL!

export async function proxyToBackend({
  endpoint,
  method,
  req,
  accessTokenOverride,
}: {
  endpoint: string
  method: "POST" | "PATCH" | "PUT" | "DELETE"
  req: NextRequest
  accessTokenOverride?: string | null
}) {
  const cookieStore = await cookies()

  const token =
    accessTokenOverride ?? cookieStore.get("access_token")?.value

  const url = `${API_URL.replace(/\/$/, "")}${endpoint}`

  const backendRes = await fetch(url, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // reenviamos headers originales (importante para multipart)
      ...Object.fromEntries(req.headers),
    },
    body: req.body,
    duplex: "half",
  } as RequestInit & { duplex: "half" })

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: backendRes.headers,
  })
}
