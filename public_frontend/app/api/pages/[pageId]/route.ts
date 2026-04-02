// app/api/pages/[pageId]/comments/route.ts
import { NextRequest, NextResponse } from "next/server"
import { proxyToBackend } from "@/lib/backendProxy"
import { ensureValidAccessToken } from "@/lib/ensureValidAccessToken"

const API_URL = process.env.API_URL!

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params

  const res = await fetch(
    `${API_URL}/api/v1/pages/${pageId}/`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error fetching page" },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {

  const { pageId } = await params
  const freshToken = await ensureValidAccessToken()

  return proxyToBackend({
    endpoint: `/api/v1/pages/${pageId}/`,
    method: "PATCH",
    req,
    accessTokenOverride: freshToken,
  })
}
