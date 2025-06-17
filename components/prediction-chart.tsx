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

import { calculateEvasaoPredictions } from "@/lib/predictions"

interface PredictionChartProps {
  region: string
  location: string
  network: string
}

export function PredictionChart({ region, location, network }: PredictionChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const predictions = await calculateEvasaoPredictions(region, location, network)
        setData(predictions)
      } catch (error) {
        console.error("Erro ao carregar previsões:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [region, location, network])

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Encontrar o último ano de dados reais
  const lastRealDataYear = data.filter((item) => !item.isPrediction).slice(-1)[0]?.year || 0

  return (
    <div className="h-[400px] w-full">
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
          <YAxis label={{ value: "Taxa de Evasão (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value, name) => {
              const formattedName =
                name === "evasao_em"
                  ? "Ensino Médio (Total)"
                  : name === "evasao_em_1_ano"
                    ? "1º Ano"
                    : name === "evasao_em_2_ano"
                      ? "2º Ano"
                      : "3º Ano"
              return [`${value}%`, formattedName]
            }}
            labelFormatter={(label) => `Ano: ${label}`}
          />
          <Legend
            formatter={(value) => {
              return value === "evasao_em"
                ? "Ensino Médio (Total)"
                : value === "evasao_em_1_ano"
                  ? "1º Ano"
                  : value === "evasao_em_2_ano"
                    ? "2º Ano"
                    : "3º Ano"
            }}
          />
          <ReferenceLine
            x={lastRealDataYear}
            stroke="#666"
            strokeDasharray="3 3"
            label={{ value: "Previsão", position: "top" }}
          />

          <Line
            type="monotone"
            dataKey="evasao_em"
            name="evasao_em"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="evasao_em_1_ano"
            name="evasao_em_1_ano"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="evasao_em_2_ano"
            name="evasao_em_2_ano"
            stroke="#ffc658"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="evasao_em_3_ano"
            name="evasao_em_3_ano"
            stroke="#ff8042"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
