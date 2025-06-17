"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

import { getAverageByRegion } from "@/lib/data"

interface EvasaoBarChartProps {
  year: string
  location: string
  network: string
}

export function EvasaoBarChart({ year, location, network }: EvasaoBarChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const chartData = await getAverageByRegion(year, location, network)
        setData(chartData)
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year, location, network])

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
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
          <XAxis dataKey="name" />
          <YAxis label={{ value: "Taxa de Evasão (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => [`${value}%`, ""]} />
          <Legend />
          <Bar dataKey="1º Ano" fill="#8884d8" />
          <Bar dataKey="2º Ano" fill="#82ca9d" />
          <Bar dataKey="3º Ano" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
