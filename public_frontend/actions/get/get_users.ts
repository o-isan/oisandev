"use server"
import {fetchWithAuth} from "@/actions/auth"

export async function getUsers(page : number = 1) {
  const res = await fetchWithAuth(`/api/v1/users/?page=${page}`);

  if (!res.ok) {
    throw new Error("Error al cargar los usuarios")
  }

  let result = await res.json()
  return result
}
