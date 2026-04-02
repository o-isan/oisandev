"use client"
import { useTransition } from "react"
import { CommentForm } from "./comment-form"
import { addComment } from "@/actions/post/add_comment"

export function CommentCardWrite({ pageSlug }: { pageSlug: string }) {
  const [isPending, startTransition] = useTransition()

  const handleAddComment = (data: {
    name: string
    lastName: string
    content: string
    author_email: string
  }) => {
    startTransition(async () => {
      await addComment({
        author: `${data.name} ${data.lastName}`,
        content: data.content,
        author_email: data.author_email,
        pageSlug : pageSlug,
      })
    })
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="mt-8 rounded-lg border border-border bg-accent/30 p-6">
        <h3 className="mb-4 text-lg font-medium text-foreground">
          Deja tu comentario
        </h3>

        <CommentForm onSubmit={handleAddComment} disabled={isPending} />
      </div>
    </section>
  )
}
