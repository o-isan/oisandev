"use server"

import { fetchWithAuth } from "@/actions/auth"

export async function addPage(formData: FormData) {
  const res = await fetchWithAuth("/api/v1/pages/", {
    method: "POST",
    body: formData, // 👈 FormData REAL
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || "Error creando página")
  }

  return res.json()
}
