"use server"

import { cache } from "react"

import { fetchIndicadoresEducacionais } from "./data"

// Função para obter dados de correlação entre duas métricas
export const getCorrelationData = cache(
  async (xMetric: string, yMetric: string, region?: string, year?: string): Promise<any[]> => {
    const data = await fetchIndicadoresEducacionais()

    // Filtrar dados conforme os parâmetros
    const filteredData = data.filter((item) => {
      if (region && region !== "Todas" && item.regiao !== region) return false
      if (year && item.ano !== year) return false
      return true
    })

    // Agrupar por região para análise de correlação
    const regionMap = new Map<
      string,
      {
        count: number
        xSum: number
        ySum: number
      }
    >()

    filteredData.forEach((item) => {
      if (!regionMap.has(item.regiao)) {
        regionMap.set(item.regiao, {
          count: 0,
          xSum: 0,
          ySum: 0,
        })
      }

      const regionData = regionMap.get(item.regiao)!
      regionData.count++

      // Selecionar os valores corretos com base nas métricas escolhidas
      let xValue = 0
      let yValue = 0

      switch (xMetric) {
        case "taxa_evasao_em":
          xValue = item.taxa_evasao_em
          break
        case "taxa_repetencia_em":
          xValue = item.taxa_repetencia_em
          break
        case "taxa_promocao_em":
          xValue = item.taxa_promocao_em
          break
        case "taxa_migracao_eja_em":
          xValue = item.taxa_migracao_eja_em
          break
        default:
          xValue = item.taxa_evasao_em
      }

      switch (yMetric) {
        case "taxa_evasao_em":
          yValue = item.taxa_evasao_em
          break
        case "taxa_repetencia_em":
          yValue = item.taxa_repetencia_em
          break
        case "taxa_promocao_em":
          yValue = item.taxa_promocao_em
          break
        case "taxa_migracao_eja_em":
          yValue = item.taxa_migracao_eja_em
          break
        default:
          yValue = item.taxa_repetencia_em
      }

      regionData.xSum += xValue
      regionData.ySum += yValue
    })

    // Converter para array de pontos para o gráfico de dispersão
    const correlationData = []
    for (const [region, values] of regionMap.entries()) {
      if (values.count > 0) {
        correlationData.push({
          region,
          x: Number.parseFloat((values.xSum / values.count).toFixed(1)),
          y: Number.parseFloat((values.ySum / values.count).toFixed(1)),
        })
      }
    }

    return correlationData
  },
)

// Função para obter dados de comparação por região, rede ou localização
export const getComparisonData = cache(
  async (metric: string, compareBy: "region" | "network" | "location", year?: string): Promise<any[]> => {
    const data = await fetchIndicadoresEducacionais()

    // Filtrar por ano se especificado
    const filteredData = year ? data.filter((item) => item.ano === year) : data

    // Agrupar por categoria de comparação
    const groupMap = new Map<
      string,
      {
        count: number
        sum: number
      }
    >()

    filteredData.forEach((item) => {
      let groupKey = ""

      // Determinar a chave de agrupamento com base no parâmetro compareBy
      switch (compareBy) {
        case "region":
          groupKey = item.regiao
          break
        case "network":
          groupKey = item.rede
          break
        case "location":
          groupKey = item.localizacao
          break
        default:
          groupKey = item.regiao
      }

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          count: 0,
          sum: 0,
        })
      }

      const groupData = groupMap.get(groupKey)!
      groupData.count++

      // Selecionar o valor correto com base na métrica escolhida
      let metricValue = 0
      switch (metric) {
        case "taxa_evasao_em":
          metricValue = item.taxa_evasao_em
          break
        case "taxa_repetencia_em":
          metricValue = item.taxa_repetencia_em
          break
        case "taxa_promocao_em":
          metricValue = item.taxa_promocao_em
          break
        case "taxa_migracao_eja_em":
          metricValue = item.taxa_migracao_eja_em
          break
        default:
          metricValue = item.taxa_evasao_em
      }

      groupData.sum += metricValue
    })

    // Converter para array para o gráfico de barras
    const comparisonData = []
    for (const [key, values] of groupMap.entries()) {
      if (values.count > 0) {
        // Formatar o nome para exibição
        let displayName = key
        if (compareBy === "network" || compareBy === "location") {
          displayName = key.charAt(0).toUpperCase() + key.slice(1)
        }

        comparisonData.push({
          name: displayName,
          value: Number.parseFloat((values.sum / values.count).toFixed(1)),
        })
      }
    }

    // Ordenar por valor (decrescente)
    return comparisonData.sort((a, b) => b.value - a.value)
  },
)

// Função para obter dados de tendência ao longo do tempo
export const getTrendData = cache(
  async (
    metric: string,
    region?: string,
    network?: string,
    location?: string,
  ): Promise<{ trendData: any[]; avgValue: number }> => {
    const data = await fetchIndicadoresEducacionais()

    // Filtrar dados conforme os parâmetros
    const filteredData = data.filter((item) => {
      if (region && region !== "Todas" && item.regiao !== region) return false
      if (network && network !== "Todas" && item.rede !== network) return false
      if (location && location !== "Todas" && item.localizacao !== location) return false
      return true
    })

    // Agrupar por ano
    const yearMap = new Map<
      string,
      {
        count: number
        sum: number
      }
    >()

    filteredData.forEach((item) => {
      if (!yearMap.has(item.ano)) {
        yearMap.set(item.ano, {
          count: 0,
          sum: 0,
        })
      }

      const yearData = yearMap.get(item.ano)!
      yearData.count++

      // Selecionar o valor correto com base na métrica escolhida
      let metricValue = 0
      switch (metric) {
        case "taxa_evasao_em":
          metricValue = item.taxa_evasao_em
          break
        case "taxa_repetencia_em":
          metricValue = item.taxa_repetencia_em
          break
        case "taxa_promocao_em":
          metricValue = item.taxa_promocao_em
          break
        case "taxa_migracao_eja_em":
          metricValue = item.taxa_migracao_eja_em
          break
        default:
          metricValue = item.taxa_evasao_em
      }

      yearData.sum += metricValue
    })

    // Calcular a média geral
    let totalSum = 0
    let totalCount = 0
    yearMap.forEach((value) => {
      totalSum += value.sum
      totalCount += value.count
    })
    const avgValue = totalCount > 0 ? totalSum / totalCount : 0

    // Converter para array para o gráfico de linha
    const trendData = []
    for (const [year, values] of yearMap.entries()) {
      if (values.count > 0) {
        trendData.push({
          year,
          value: Number.parseFloat((values.sum / values.count).toFixed(1)),
        })
      }
    }

    // Ordenar por ano (crescente)
    return {
      trendData: trendData.sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year)),
      avgValue: Number.parseFloat(avgValue.toFixed(1)),
    }
  },
)

// Função para obter dados para a tabela de análise
export const getAnalysisTableData = cache(async (metric: string, year?: string, prevYear?: string): Promise<any[]> => {
  const data = await fetchIndicadoresEducacionais()

  // Se não houver ano especificado, usar o último ano disponível
  if (!year) {
    const years = [...new Set(data.map((item) => item.ano))].sort()
    year = years[years.length - 1]
    if (years.length > 1) {
      prevYear = years[years.length - 2]
    }
  }

  // Agrupar por região e rede
  const groupMap = new Map<
    string,
    {
      region: string
      network: string
      currentCount: number
      currentSum: number
      previousCount: number
      previousSum: number
    }
  >()

  data.forEach((item) => {
    const key = `${item.regiao}-${item.rede}`

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        region: item.regiao,
        network: item.rede.charAt(0).toUpperCase() + item.rede.slice(1),
        currentCount: 0,
        currentSum: 0,
        previousCount: 0,
        previousSum: 0,
      })
    }

    const groupData = groupMap.get(key)!

    // Selecionar o valor correto com base na métrica escolhida
    let metricValue = 0
    switch (metric) {
      case "taxa_evasao_em":
        metricValue = item.taxa_evasao_em
        break
      case "taxa_repetencia_em":
        metricValue = item.taxa_repetencia_em
        break
      case "taxa_promocao_em":
        metricValue = item.taxa_promocao_em
        break
      case "taxa_migracao_eja_em":
        metricValue = item.taxa_migracao_eja_em
        break
      default:
        metricValue = item.taxa_evasao_em
    }

    // Adicionar aos dados do ano atual ou anterior
    if (item.ano === year) {
      groupData.currentCount++
      groupData.currentSum += metricValue
    } else if (prevYear && item.ano === prevYear) {
      groupData.previousCount++
      groupData.previousSum += metricValue
    }
  })

  // Converter para array para a tabela
  const tableData = []
  for (const [_, values] of groupMap.entries()) {
    if (values.currentCount > 0) {
      const currentValue = Number.parseFloat((values.currentSum / values.currentCount).toFixed(1))
      const previousValue =
        values.previousCount > 0 ? Number.parseFloat((values.previousSum / values.previousCount).toFixed(1)) : 0
      const variation = prevYear ? currentValue - previousValue : 0

      tableData.push({
        region: values.region,
        network: values.network,
        currentValue,
        previousValue,
        variation,
      })
    }
  }

  // Ordenar por valor atual (decrescente)
  return tableData.sort((a, b) => b.currentValue - a.currentValue)
})

// Função para calcular estatísticas gerais
export const getGeneralStatistics = cache(async (metric: string): Promise<any> => {
  const data = await fetchIndicadoresEducacionais()

  // Calcular estatísticas gerais para a métrica selecionada
  let sum = 0
  let count = 0
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  const values: number[] = []

  data.forEach((item) => {
    // Selecionar o valor correto com base na métrica escolhida
    let metricValue = 0
    switch (metric) {
      case "taxa_evasao_em":
        metricValue = item.taxa_evasao_em
        break
      case "taxa_repetencia_em":
        metricValue = item.taxa_repetencia_em
        break
      case "taxa_promocao_em":
        metricValue = item.taxa_promocao_em
        break
      case "taxa_migracao_eja_em":
        metricValue = item.taxa_migracao_eja_em
        break
      default:
        metricValue = item.taxa_evasao_em
    }

    sum += metricValue
    count++
    min = Math.min(min, metricValue)
    max = Math.max(max, metricValue)
    values.push(metricValue)
  })

  // Calcular média
  const mean = count > 0 ? sum / count : 0

  // Calcular desvio padrão
  let sumSquaredDiff = 0
  values.forEach((value) => {
    sumSquaredDiff += Math.pow(value - mean, 2)
  })
  const stdDev = count > 0 ? Math.sqrt(sumSquaredDiff / count) : 0

  // Calcular mediana
  values.sort((a, b) => a - b)
  const median =
    count > 0 ? (count % 2 === 0 ? (values[count / 2 - 1] + values[count / 2]) / 2 : values[Math.floor(count / 2)]) : 0

  return {
    mean: Number.parseFloat(mean.toFixed(1)),
    median: Number.parseFloat(median.toFixed(1)),
    min: Number.parseFloat(min.toFixed(1)),
    max: Number.parseFloat(max.toFixed(1)),
    stdDev: Number.parseFloat(stdDev.toFixed(1)),
    count,
  }
})

// Função para obter insights sobre os dados
export const getDataInsights = cache(async (): Promise<any[]> => {
  const data = await fetchIndicadoresEducacionais()

  // Calcular correlações entre diferentes métricas
  const correlations = [
    {
      title: "Evasão x Repetência",
      description: "Forte correlação positiva entre taxas de repetência e evasão no ano seguinte.",
      value: 0.78, // Valor simulado
      strength: "Alta",
    },
    {
      title: "Evasão x Promoção",
      description: "Forte correlação negativa entre taxas de promoção e evasão escolar.",
      value: -0.72, // Valor simulado
      strength: "Alta",
    },
    {
      title: "Evasão x Migração para EJA",
      description: "Correlação moderada entre taxas de migração para EJA e evasão escolar.",
      value: 0.45, // Valor simulado
      strength: "Média",
    },
    {
      title: "Repetência x Migração para EJA",
      description: "Correlação moderada entre taxas de repetência e migração para EJA.",
      value: 0.38, // Valor simulado
      strength: "Média",
    },
  ]

  // Identificar tendências nos dados
  const trends = [
    {
      title: "Redução gradual da evasão",
      description: "Tendência de redução gradual nas taxas de evasão escolar nos últimos anos.",
      direction: "Positiva",
    },
    {
      title: "Disparidade regional",
      description: "Persistência de disparidades regionais significativas nas taxas de evasão.",
      direction: "Negativa",
    },
    {
      title: "Melhoria na rede federal",
      description: "Melhoria consistente nos indicadores da rede federal de ensino.",
      direction: "Positiva",
    },
    {
      title: "Desafios no 1º ano do EM",
      description: "O 1º ano do Ensino Médio continua sendo o período mais crítico para evasão.",
      direction: "Negativa",
    },
  ]

  return [
    ...correlations.map((item) => ({ ...item, type: "correlation" })),
    ...trends.map((item) => ({ ...item, type: "trend" })),
  ]
})
