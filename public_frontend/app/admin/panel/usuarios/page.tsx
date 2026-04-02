"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { getUsers } from "@/actions/get/get_users"

type User = {
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const reloadPages = () => {
    startTransition(async () => {
      const data = await getUsers()
      setUsers(data.results)
      setUsers(
        data.results.map((u: any) => ({
          username: u.username,
          email: u.email,
          first_name: u.first_name,
          last_name: u.last_name,
          is_active: u.is_active,
        }))
      )
    })
  }

  useEffect(() => {
    reloadPages()
  }, [])

  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", role: "Autor" })

  const handleCreate = () => {
    if (!newUser.first_name || !newUser.email) return

    const user: User = {
      username: newUser.email.split("@")[0] || "user",
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      is_active: true,
    }

    setUsers([...users, user])
    setNewUser({ first_name: "", last_name: "", email: "", role: "Autor" })
    setIsOpen(false)
  }

  const handleDelete = (user: User) => {
    setUsers(users.filter((u) => u.username !== user.username))
  }

  const columns = [
    { key: "id" as const, header: "Nombre de usuario" },
    { key: "email" as const, header: "Email" },
    { key: "first_name" as const, header: "Nombre" },
    { key: "last_name" as const, header: "Apellidos" },
    { key: "is_active" as const, header: "¿Activo?" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground mt-1">Vea los usuarios del sistema</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>

          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Crear Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-foreground">Nombre</Label>
                <Input
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                  placeholder="Nombre"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className="bg-input border-border"
                />
              </div>

            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isPending && (
        <p className="text-sm text-muted-foreground">
          Actualizando…
        </p>
      )}

      <DataTable data={users} columns={columns} />

    </div>
  )
}
