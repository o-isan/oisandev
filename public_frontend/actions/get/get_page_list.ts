"use server"

const API_URL = process.env.API_URL!

export async function getPages(page : number = 1) {

  const res = await fetch(`${API_URL}/api/v1/pages/?page=${page}`, {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error("Error obteniendo páginas")
  }

  const data = await res.json()
  return data;

}
