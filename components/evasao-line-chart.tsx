"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

import { getEvasaoOverTime } from "@/lib/data"

interface EvasaoLineChartProps {
  region: string
  location: string
  network: string
}

export function EvasaoLineChart({ region, location, network }: EvasaoLineChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const chartData = await getEvasaoOverTime(region, location, network)
        setData(chartData)
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [region, location, network])

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
          <XAxis dataKey="year" />
          <YAxis label={{ value: "Taxa de Evasão (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => [`${value}%`, "Taxa de Evasão"]} />
          <Legend />
          <Line type="monotone" dataKey="evasao" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
