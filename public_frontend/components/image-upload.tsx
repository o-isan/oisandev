"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: File | null
  onChange: (file: File | null) => void
  maxSize?: number // en MB
  className?: string
  label?: string
  previewHeight?: string
}

export function ImageUpload({
  value,
  onChange,
  maxSize = 5,
  className,
  label = "Imagen",
  previewHeight = "200px",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido")
        return
      }

      // Validar tamaño
      const maxSizeBytes = maxSize * 1024 * 1024
      if (file.size > maxSizeBytes) {
        alert(`La imagen es demasiado grande. El tamaño máximo es ${maxSize}MB`)
        return
      }

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Actualizar el valor
      onChange(file)
    },
    [maxSize, onChange]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        // Preview de la imagen
        <div className="relative rounded-lg border border-border overflow-hidden bg-muted/30">
          <div
            className="relative w-full flex items-center justify-center"
            style={{ height: previewHeight }}
          >
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
              className="h-8 gap-2"
            >
              <Upload className="h-4 w-4" />
              Cambiar
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="h-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {value && (
            <div className="p-2 bg-muted/50 text-xs text-muted-foreground border-t border-border">
              <div className="flex items-center justify-between">
                <span className="truncate max-w-[200px]">{value.name}</span>
                <span>{(value.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Área de drop/upload
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
          style={{ height: previewHeight }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div
              className={cn(
                "rounded-full p-4 transition-colors",
                isDragging ? "bg-primary/10" : "bg-muted"
              )}
            >
              <ImageIcon
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragging ? "Suelta la imagen aquí" : "Haz clic o arrastra una imagen"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF hasta {maxSize}MB
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="pointer-events-none"
            >
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar imagen
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}