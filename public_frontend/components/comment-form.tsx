"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CommentFormProps {
  onSubmit: (data: { name: string; lastName: string; content: string; author_email: string }) => void
  disabled?: boolean  // ✅ Agregado
}

export function CommentForm({ onSubmit, disabled }: CommentFormProps) {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [content, setContent] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && lastName.trim() && content.trim() && email.trim()) {
      onSubmit({ name, lastName, content, author_email: email })
      setName("")
      setLastName("")
      setContent("")
      setEmail("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
            Nombre
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            disabled={disabled}  // ✅ Agregado
          />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-foreground">
            Apellidos
          </label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Tus apellidos"
            required
            disabled={disabled}  // ✅ Agregado
          />
        </div>
      </div>

      <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
        Email (no se mostrará)
      </label>
      <Input
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu correo electrónico"
        required
        disabled={disabled}  // ✅ Agregado
      />

      <div>
        <label htmlFor="comment" className="mb-2 block text-sm font-medium text-foreground">
          Comentario
        </label>
        <Textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu comentario..."
          rows={4}
          required
          disabled={disabled}  // ✅ Agregado
          maxLength={500}
        />
      </div>

      <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90" disabled={disabled}>
        Publicar comentario
      </Button>
    </form>
  )
}