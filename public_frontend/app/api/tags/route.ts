// app/api/pages/[pageId]/comments/route.ts
import { NextResponse } from "next/server"

const API_URL = process.env.API_URL!

export async function GET(
  req: Request,
) {

  const res = await fetch(
    `${API_URL}/api/v1/tags/`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error fetching tags" },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
