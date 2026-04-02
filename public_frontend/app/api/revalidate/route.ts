// app/api/revalidate/route.ts
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { tag } = await request.json()

    // ⚡ Ahora cumple la firma de TS
    revalidateTag(tag, {})

    return NextResponse.json({ revalidated: true })
  } catch (error) {
    console.error("Error revalidating tag:", error)
    return NextResponse.json({ error: "Failed to revalidate tag" }, { status: 500 })
  }
}