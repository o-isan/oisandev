"use client"

import type React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil } from "lucide-react"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  rowKey?: keyof T   // 👈 opcional
  onDelete?: (item: T) => void
  onEdit?: (item: T) => void
  showEdit?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey = "id", // 👈 default
  onDelete,
  onEdit,
  showEdit = false,
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className="text-muted-foreground font-medium"
              >
                {column.header}
              </TableHead>
            ))}
            <TableHead className="text-muted-foreground font-medium w-24">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center text-muted-foreground py-8"
              >
                No hay elementos para mostrar
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const key = String(item[rowKey])

              return (
                <TableRow key={key} className="border-border">
                  {columns.map((column) => (
                    <TableCell
                      key={`${key}-${String(column.key)}`}
                      className="text-foreground"
                    >
                      {column.render
                        ? column.render(item)
                        : String((item as Record<string, unknown>)[column.key as string] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {showEdit && onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-accent"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
