"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { calculateRiskFactors } from "@/lib/predictions"

export function RiskFactors() {
  const [riskFactors, setRiskFactors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const factors = await calculateRiskFactors()
        setRiskFactors(factors)
      } catch (error) {
        console.error("Erro ao carregar fatores de risco:", error)
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {riskFactors.map((factor) => (
        <Card key={factor.region} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>{factor.region}</span>
              {factor.riskCategory === "Alto" ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : factor.riskCategory === "Médio" ? (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </CardTitle>
            <CardDescription>Nível de risco: {factor.riskCategory}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress
                value={factor.riskLevel}
                className={
                  factor.riskCategory === "Alto"
                    ? "bg-red-100"
                    : factor.riskCategory === "Médio"
                      ? "bg-amber-100"
                      : "bg-green-100"
                }
                indicatorClassName={
                  factor.riskCategory === "Alto"
                    ? "bg-red-500"
                    : factor.riskCategory === "Médio"
                      ? "bg-amber-500"
                      : "bg-green-500"
                }
              />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxa de Evasão (1º ano):</span>
                <span className="font-medium">{factor.avgEvasao}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxa de Repetência:</span>
                <span className="font-medium">{factor.avgRepetencia}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxa de Promoção:</span>
                <span className="font-medium">{factor.avgPromocao}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Migração para EJA:</span>
                <span className="font-medium">{factor.avgMigracaoEja}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
