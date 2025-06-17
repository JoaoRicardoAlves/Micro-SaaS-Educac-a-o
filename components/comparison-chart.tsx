"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts"

import { getComparisonData } from "@/lib/analysis"

interface ComparisonChartProps {
  metric: string
  compareBy: "region" | "network" | "location"
  year?: string
}

export function ComparisonChart({ metric, compareBy, year }: ComparisonChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const comparisonData = await getComparisonData(metric, compareBy, year)
        setData(comparisonData)
      } catch (error) {
        console.error("Erro ao carregar dados de comparação:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [metric, compareBy, year])

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Obter rótulo amigável para o eixo Y
  const getMetricLabel = (metricName: string) => {
    switch (metricName) {
      case "taxa_evasao_em":
        return "Taxa de Evasão (EM)"
      case "taxa_repetencia_em":
        return "Taxa de Repetência (EM)"
      case "taxa_promocao_em":
        return "Taxa de Promoção (EM)"
      case "taxa_migracao_eja_em":
        return "Taxa de Migração para EJA (EM)"
      default:
        return metricName
    }
  }

  // Obter rótulo amigável para o eixo X
  const getCompareByLabel = (compareByName: string) => {
    switch (compareByName) {
      case "region":
        return "Região"
      case "network":
        return "Rede de Ensino"
      case "location":
        return "Localização"
      default:
        return compareByName
    }
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{ value: getCompareByLabel(compareBy), position: "insideBottomRight", offset: -5 }}
          />
          <YAxis label={{ value: getMetricLabel(metric), angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => [`${value}%`, getMetricLabel(metric)]} />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name={getMetricLabel(metric)}>
            <LabelList dataKey="value" position="top" formatter={(value: number) => `${value}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
