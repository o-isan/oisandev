"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"

interface CommentCardProps {
  author: string
  content: string
  date: string
}

export function CommentCard({ author, content, date }: CommentCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isLongComment = content.length > 50

  const displayContent = isLongComment && !expanded ? content.substring(0, 50) + "..." : content

  return (
    <div className="border-b border-border py-6 last:border-0">
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground">{author}</span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <p className="mt-2 leading-relaxed text-muted-foreground">
        {displayContent}
        {isLongComment && (
          <button onClick={() => setExpanded(!expanded)} className="ml-1 font-medium text-foreground hover:underline">
            {expanded ? "Ver menos" : "Ver más"}
          </button>
        )}
      </p>
    </div>
  )
}
