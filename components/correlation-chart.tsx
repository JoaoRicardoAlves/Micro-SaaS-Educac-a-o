"use client"

import { useEffect, useState } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
} from "recharts"

import { getCorrelationData } from "@/lib/analysis"

interface CorrelationChartProps {
  xMetric: string
  yMetric: string
  region?: string
  year?: string
}

export function CorrelationChart({ xMetric, yMetric, region, year }: CorrelationChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const correlationData = await getCorrelationData(xMetric, yMetric, region, year)
        setData(correlationData)
      } catch (error) {
        console.error("Erro ao carregar dados de correlação:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [xMetric, yMetric, region, year])

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Obter rótulos amigáveis para os eixos
  const getAxisLabel = (metric: string) => {
    switch (metric) {
      case "taxa_evasao_em":
        return "Taxa de Evasão (EM)"
      case "taxa_repetencia_em":
        return "Taxa de Repetência (EM)"
      case "taxa_promocao_em":
        return "Taxa de Promoção (EM)"
      case "taxa_migracao_eja_em":
        return "Taxa de Migração para EJA (EM)"
      default:
        return metric
    }
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            name={getAxisLabel(xMetric)}
            label={{ value: getAxisLabel(xMetric), position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={getAxisLabel(yMetric)}
            label={{ value: getAxisLabel(yMetric), angle: -90, position: "insideLeft" }}
          />
          <ZAxis type="number" range={[60, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => [`${value}%`, name === "x" ? getAxisLabel(xMetric) : getAxisLabel(yMetric)]}
            labelFormatter={(_, payload) => {
              if (payload && payload.length > 0) {
                return `Região: ${payload[0].payload.region}`
              }
              return ""
            }}
          />
          <Legend />
          <Scatter name="Regiões" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
