"use server"

export async function getCategories(page : number = 1) {
  const res = await fetch(
    `${process.env.API_URL}/api/v1/categories/?page=${page}`, {
      cache: "no-store"
    })

  if (!res.ok) {
    throw new Error("Error al cargar categorías")
  }

  let result = await res.json()
  return result
}
