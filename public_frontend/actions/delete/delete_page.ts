"use server"
import {fetchWithAuth} from "@/actions/auth"

export async function deletePage(slug : string) {
  const res = await fetchWithAuth(`/api/v1/pages/${slug}/`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error("Error al eliminar la página")
  }

  return 200;
}
