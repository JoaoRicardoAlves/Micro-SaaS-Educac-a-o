"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3 } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold">EvasãoStat</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-end space-x-4">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/analise"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/analise") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Análise
          </Link>
          <Link
            href="/previsoes"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/previsoes") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Previsões
          </Link>
          <Link
            href="/solucoes"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/solucoes") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Soluções
          </Link>
        </nav>
      </div>
    </header>
  )
}
