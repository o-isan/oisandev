import { NextRequest } from "next/server"
import { proxyToBackend } from "@/lib/backendProxy"
import { ensureValidAccessToken } from "@/lib/ensureValidAccessToken"
import { NextResponse } from "next/server"

const API_URL = process.env.API_URL!

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") ?? "1"
  const category = searchParams.get("category")
  const tag = searchParams.get("tag")

  const qs = new URLSearchParams()
  qs.set("page", page)
  if (category) qs.set("category", category)
  if (tag) qs.set("tag", tag)

  const res = await fetch(
    `${API_URL}/api/v1/pages/?${qs.toString()}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error fetching page" },
      { status: res.status }
    )
  }

  return NextResponse.json(await res.json())
}


export async function POST(req: NextRequest) {
  const freshToken = await ensureValidAccessToken()

  return proxyToBackend({
    endpoint: "/api/v1/pages/",
    method: "POST",
    req,
    accessTokenOverride: freshToken,
  })
}