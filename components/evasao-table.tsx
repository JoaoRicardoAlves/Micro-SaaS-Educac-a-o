"use client"

import { useEffect, useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDetailedEvasaoData } from "@/lib/data"

interface EvasaoTableProps {
  type: "evasao" | "repetencia" | "promocao" | "eja"
  region: string
  year: string
  location: string
  network: string
}

export function EvasaoTable({ type, region, year, location, network }: EvasaoTableProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const tableData = await getDetailedEvasaoData(type, region, year, location, network)
        setData(tableData)
      } catch (error) {
        console.error("Erro ao carregar dados da tabela:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type, region, year, location, network])

  // Determinar o título da tabela com base no tipo
  const getTableTitle = () => {
    switch (type) {
      case "evasao":
        return "Taxa de Evasão (%)"
      case "repetencia":
        return "Taxa de Repetência (%)"
      case "promocao":
        return "Taxa de Promoção (%)"
      case "eja":
        return "Taxa de Migração para EJA (%)"
      default:
        return "Dados"
    }
  }

  if (loading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Região</TableHead>
            <TableHead>Ensino Fundamental</TableHead>
            <TableHead>EM - 1º Ano</TableHead>
            <TableHead>EM - 2º Ano</TableHead>
            <TableHead>EM - 3º Ano</TableHead>
            <TableHead>EM - Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.regiao}>
              <TableCell className="font-medium">{item.regiao}</TableCell>
              <TableCell>{item.ef}%</TableCell>
              <TableCell>{item.em_1}%</TableCell>
              <TableCell>{item.em_2}%</TableCell>
              <TableCell>{item.em_3}%</TableCell>
              <TableCell className="font-medium">{item.em_total}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
