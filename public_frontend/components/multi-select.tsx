"use client"

import * as React from "react"
import { X } from "lucide-react"

export type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Seleccionar...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  // 🔒 Garantizamos unicidad siempre
  const safeSelected = React.useMemo(
    () => Array.from(new Set(selected)),
    [selected]
  )

  const toggle = (value: string) => {
    if (safeSelected.includes(value)) {
      onChange(safeSelected.filter(v => v !== value))
    } else {
      onChange([...safeSelected, value])
    }
  }

  const remove = (value: string) => {
    onChange(safeSelected.filter(v => v !== value))
  }

  return (
    <div className="relative w-full">
      {/* INPUT AREA */}
      <div
        className="min-h-10 border rounded-md px-2 py-1 flex flex-wrap gap-1 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        {safeSelected.length === 0 && (
          <span className="text-muted-foreground text-sm">
            {placeholder}
          </span>
        )}

        {safeSelected.map((value) => {
          const option = options.find(o => o.value === value)

          return (
            <div
              key={`badge-${value}`}
              className="bg-secondary text-secondary-foreground text-sm px-2 py-1 rounded-md flex items-center gap-1"
            >
              {option?.label ?? value}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  remove(value)
                }}
              />
            </div>
          )
        })}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-1 w-full border rounded-md bg-background shadow-md max-h-60 overflow-auto">
          {options.map(option => {
            const isSelected = safeSelected.includes(option.value)

            return (
              <div
                key={`option-${option.value}`}
                className={`px-3 py-2 cursor-pointer text-sm hover:bg-muted ${
                  isSelected ? "bg-muted" : ""
                }`}
                onClick={() => toggle(option.value)}
              >
                {option.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
