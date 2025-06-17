"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSuccessCases } from "@/lib/predictions"

export function SuccessCases() {
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const successCases = await getSuccessCases()
        setCases(successCases)
      } catch (error) {
        console.error("Erro ao carregar casos de sucesso:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (cases.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Nenhum caso de sucesso encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cases.map((item, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{item.region}</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <CardDescription>
              {item.network.charAt(0).toUpperCase() + item.network.slice(1)} - {item.year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taxa de Evasão:</span>
                <span className="font-medium text-green-600">{item.evasao}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taxa de Promoção:</span>
                <span className="font-medium">{item.promocao}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taxa de Repetência:</span>
                <span className="font-medium">{item.repetencia}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
