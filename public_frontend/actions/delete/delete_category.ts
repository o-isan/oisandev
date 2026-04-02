"use server"
import {fetchWithAuth} from "@/actions/auth"

export async function deleteCategory(slug : string) {
  const res = await fetchWithAuth(`/api/v1/categories/${slug}/`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error("Error al eliminar la categoría")
  }

  return 200;
}
