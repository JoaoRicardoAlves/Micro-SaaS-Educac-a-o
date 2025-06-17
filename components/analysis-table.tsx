"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAnalysisTableData } from "@/lib/analysis"

interface AnalysisTableProps {
  metric: string
  year?: string
  prevYear?: string
}

export function AnalysisTable({ metric, year, prevYear }: AnalysisTableProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const tableData = await getAnalysisTableData(metric, year, prevYear)
        setData(tableData)
      } catch (error) {
        console.error("Erro ao carregar dados da tabela:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [metric, year, prevYear])

  if (loading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Obter rótulo amigável para a métrica
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
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Região</TableHead>
            <TableHead>Rede</TableHead>
            <TableHead className="text-right">
              {getMetricLabel(metric)} ({year})
            </TableHead>
            {prevYear && (
              <TableHead className="text-right">
                {getMetricLabel(metric)} ({prevYear})
              </TableHead>
            )}
            {prevYear && <TableHead className="text-right">Variação</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.region}</TableCell>
              <TableCell>{item.network}</TableCell>
              <TableCell className="text-right">{item.currentValue}%</TableCell>
              {prevYear && <TableCell className="text-right">{item.previousValue}%</TableCell>}
              {prevYear && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {item.variation > 0 ? (
                      <>
                        <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
                        <span className="text-red-500">{item.variation.toFixed(1)}%</span>
                      </>
                    ) : item.variation < 0 ? (
                      <>
                        <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                        <span className="text-green-500">{Math.abs(item.variation).toFixed(1)}%</span>
                      </>
                    ) : (
                      <>
                        <Minus className="mr-1 h-4 w-4 text-gray-500" />
                        <span className="text-gray-500">0.0%</span>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
