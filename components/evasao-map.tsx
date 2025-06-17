"use client"

import { useEffect, useState } from "react"

interface EvasaoMapProps {
  year: string
  location: string
  network: string
}

export function EvasaoMap({ year, location, network }: EvasaoMapProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulação de carregamento do mapa
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [year, location, network])

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="h-full w-full bg-muted p-4">
          <div className="flex h-full flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Mapa interativo do Brasil mostrando a taxa de evasão por estado
              </p>
              <p className="mt-2 text-sm">
                Filtros aplicados: Ano: {year}, Localização: {location}, Rede: {network}
              </p>
            </div>
            <div className="mt-4 h-[300px] w-[300px] bg-background">
              {/* Aqui seria renderizado um mapa real do Brasil com dados de evasão */}
              <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <path
                  d="M400 100C539.746 100 650 210.254 650 350C650 489.746 539.746 600 400 600C260.254 600 150 489.746 150 350C150 210.254 260.254 100 400 100Z"
                  fill="#f1f5f9"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <path
                  d="M250 250C250 250 300 200 400 200C500 200 550 250 550 250C550 250 500 350 400 350C300 350 250 250 250 250Z"
                  fill="#8884d8"
                  opacity="0.7"
                />
                <path
                  d="M250 450C250 450 300 400 400 400C500 400 550 450 550 450C550 450 500 550 400 550C300 550 250 450 250 450Z"
                  fill="#82ca9d"
                  opacity="0.7"
                />
                <path
                  d="M200 350C200 350 300 300 400 300C500 300 600 350 600 350C600 350 500 450 400 450C300 450 200 350 200 350Z"
                  fill="#ffc658"
                  opacity="0.7"
                />
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-[#8884d8]"></div>
                <span className="text-xs">Alta Evasão (&gt;12%)</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-[#82ca9d]"></div>
                <span className="text-xs">Média Evasão (8-12%)</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-[#ffc658]"></div>
                <span className="text-xs">Baixa Evasão (&lt;8%)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
