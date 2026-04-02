// app/api/pages/[pageId]/comments/route.ts
import { NextResponse } from "next/server"

const API_URL = process.env.API_URL!

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params
  const { searchParams } = new URL(req.url)

  const page = searchParams.get("page") ?? "1"

  const res = await fetch(
    `${API_URL}/api/v1/pages/${pageId}/comments/?page=${page}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error fetching comments" },
      { status: res.status }
    )
  }

  const data = await res.json()

  return NextResponse.json(data)
}
