"use server"
import { fetchWithAuth } from "@/actions/auth"

export async function addTag(data: {
  name: string
}) {
  const res = await fetchWithAuth("/api/v1/tags/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || "Error creando etiqueta")
  }

  return res.json()
}
