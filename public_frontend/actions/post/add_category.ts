"use server"
import { fetchWithAuth } from "@/actions/auth"

export async function addCategory(data: {
  title: string
  slug: string
  description: string
}) {
  const res = await fetchWithAuth("/api/v1/categories/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || "Error creando categoría")
  }

  return res.json()
}
