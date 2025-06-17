"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

import { getTrendData } from "@/lib/analysis"

interface TrendAnalysisProps {
  metric: string
  region?: string
  network?: string
  location?: string
}

export function TrendAnalysis({ metric, region, network, location }: TrendAnalysisProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [average, setAverage] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const { trendData, avgValue } = await getTrendData(metric, region, network, location)
        setData(trendData)
        setAverage(avgValue)
      } catch (error) {
        console.error("Erro ao carregar dados de tendência:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [metric, region, network, location])

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

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: "Ano", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: getMetricLabel(metric), angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => [`${value}%`, getMetricLabel(metric)]} />
          <Legend />
          {average !== null && (
            <ReferenceLine
              y={average}
              label={{ value: `Média: ${average.toFixed(1)}%`, position: "right" }}
              stroke="#666"
              strokeDasharray="3 3"
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            name={getMetricLabel(metric)}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
