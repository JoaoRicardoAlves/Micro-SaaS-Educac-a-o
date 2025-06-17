"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getKPIs } from "@/lib/data"

interface KpiCardsProps {
  region: string
  year: string
  location: string
  network: string
}

export function KpiCards({ region, year, location, network }: KpiCardsProps) {
  const [kpis, setKpis] = useState({
    taxaMedia: 0,
    regiaoMaior: "",
    anoCritico: "",
    tendenciaMelhoria: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const kpiData = await getKPIs(region, year, location, network)
        setKpis(kpiData)
      } catch (error) {
        console.error("Erro ao carregar KPIs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [region, year, location, network])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
              <div className="h-4 w-4 animate-pulse rounded-full bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
              <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa Média de Evasão</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.taxaMedia}%</div>
          <p className="text-xs text-muted-foreground">
            {kpis.tendenciaMelhoria ? (
              <span className="flex items-center text-green-600">
                <ArrowDown className="mr-1 h-4 w-4" />
                Tendência de queda
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <ArrowUp className="mr-1 h-4 w-4" />
                Tendência de alta
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Região com Maior Evasão</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.regiaoMaior}</div>
          <p className="text-xs text-muted-foreground">Taxa de evasão acima da média nacional</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ano Mais Crítico</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.anoCritico}</div>
          <p className="text-xs text-muted-foreground">Ano com maior taxa de evasão registrada</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tendência de Melhoria</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            {kpis.tendenciaMelhoria ? (
              <>
                <TrendingDown className="mr-2 h-6 w-6 text-green-600" />
                <span className="text-2xl font-bold">Sim</span>
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-6 w-6 text-red-600" />
                <span className="text-2xl font-bold">Não</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {kpis.tendenciaMelhoria ? "Redução consistente nos últimos anos" : "Aumento preocupante nos últimos anos"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
