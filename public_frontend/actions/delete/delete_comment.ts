"use server"
import {fetchWithAuth} from "@/actions/auth"

export async function deleteComment(id : number) {
  const res = await fetchWithAuth(`/api/v1/comments/${id}/`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error("Error al eliminar el comentario")
  }

  return 200;
}
