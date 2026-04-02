"use server"

export async function getTags(page : number = 1) {
  const res = await fetch(
    `${process.env.API_URL}/api/v1/tags/`, {
      cache: "no-store"
    })

  if (!res.ok) {
    throw new Error("Error al cargar las etiquetas")
  }

  let result = await res.json()
  return result
}
