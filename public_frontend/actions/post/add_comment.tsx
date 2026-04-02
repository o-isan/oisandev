"use server"

interface AddCommentData {
  author: string
  content: string
  author_email: string
  pageSlug: string
}

export async function addComment({
  author,
  author_email,
  content,
  pageSlug,
}: AddCommentData) {
  const res = await fetch(
    `${process.env.API_URL}/api/v1/pages/${pageSlug}/comments/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "author_email" : author_email,
        "content" : content,
        "author" : author,
      }),
      cache: "no-store",
    }
  )

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || "Error al crear el comentario")
  }

  return res.json()
}
