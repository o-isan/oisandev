import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-border">
          <span className="text-4xl font-light text-muted-foreground">?</span>
        </div>
        
        <h1 className="mb-4 text-2xl font-semibold text-foreground">
          Página no encontrada
        </h1>
        
        <p className="mb-8 text-muted-foreground leading-relaxed">
          Lo sentimos, el recurso que solicita no existe o ha sido movido a otra ubicación.
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          
          <Button asChild className="gap-2 bg-foreground text-background hover:bg-foreground/90">
            <Link href="/">
              <Home className="h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
