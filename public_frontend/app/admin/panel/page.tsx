import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, FolderTree, Tags, MessageSquare } from "lucide-react"
import { UsersCounter } from "@/components/users-counter"

const API_URL = process.env.API_URL!

type ApiResponse = {
  count: number
  next: string | null
  previous: string | null
  results: unknown[]
}

async function fetchCount(endpoint: string): Promise<number> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Error fetching ${endpoint}`)
  }

  const data: ApiResponse = await res.json()
  return data.count
}

export default async function DashboardPage() {
  try {
    const [
      pagesCount,
      categoriesCount,
      tagsCount,
      commentsCount,
    ] = await Promise.all([
      fetchCount("/api/v1/pages"),
      fetchCount("/api/v1/categories"),
      fetchCount("/api/v1/tags"),
      fetchCount("/api/v1/comments"),
    ])

    const stats = [
      { name: "Usuarios", icon: Users, custom: true },
      { name: "Páginas", value: pagesCount, icon: FileText },
      { name: "Categorías", value: categoriesCount, icon: FolderTree },
      { name: "Etiquetas", value: tagsCount, icon: Tags },
      { name: "Comentarios", value: commentsCount, icon: MessageSquare },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Sea bienvenido al panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Resumen general del sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.name}
              className="bg-card border-border hover:border-foreground/20 transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-foreground/70" />
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {stat.custom ? (
                    <UsersCounter />
                  ) : (
                    stat.value ?? 0
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error(error)

    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-red-500">
          Error cargando estadísticas
        </h2>
        <p className="text-muted-foreground mt-2">
          No se pudieron obtener los datos del dashboard.
        </p>
      </div>
    )
  }
}
