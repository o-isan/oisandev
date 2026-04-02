"use server"
import {fetchWithAuth} from "@/actions/auth"

export async function deleteTag(name : string) {
  const res = await fetchWithAuth(`/api/v1/tags/${name}/`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error("Error al eliminar la etiqueta")
  }

  return 200;
}
