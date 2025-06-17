"use server"

import { cache } from "react"

import { fetchIndicadoresEducacionais } from "./data"

// Função para calcular previsões de evasão para os próximos anos
export const calculateEvasaoPredictions = cache(
  async (region?: string, location?: string, network?: string): Promise<any[]> => {
    const data = await fetchIndicadoresEducacionais()

    // Filtrar dados conforme os parâmetros
    const filteredData = data.filter((item) => {
      if (region && region !== "Todas" && item.regiao !== region) return false
      if (location && location !== "Todas" && item.localizacao !== location) return false
      if (network && network !== "Todas" && item.rede !== network) return false
      return true
    })

    // Agrupar dados por ano
    const yearMap = new Map<
      string,
      {
        count: number
        evasao_em: number
        evasao_em_1_ano: number
        evasao_em_2_ano: number
        evasao_em_3_ano: number
      }
    >()

    filteredData.forEach((item) => {
      if (!yearMap.has(item.ano)) {
        yearMap.set(item.ano, {
          count: 0,
          evasao_em: 0,
          evasao_em_1_ano: 0,
          evasao_em_2_ano: 0,
          evasao_em_3_ano: 0,
        })
      }

      const yearData = yearMap.get(item.ano)!
      yearData.count++
      yearData.evasao_em += item.taxa_evasao_em
      yearData.evasao_em_1_ano += item.taxa_evasao_em_1_ano
      yearData.evasao_em_2_ano += item.taxa_evasao_em_2_ano
      yearData.evasao_em_3_ano += item.taxa_evasao_em_3_ano
    })

    // Converter para array e ordenar por ano
    const historicalData = Array.from(yearMap.entries())
      .map(([year, values]) => ({
        year: Number.parseInt(year),
        evasao_em: Number.parseFloat((values.evasao_em / values.count).toFixed(1)),
        evasao_em_1_ano: Number.parseFloat((values.evasao_em_1_ano / values.count).toFixed(1)),
        evasao_em_2_ano: Number.parseFloat((values.evasao_em_2_ano / values.count).toFixed(1)),
        evasao_em_3_ano: Number.parseFloat((values.evasao_em_3_ano / values.count).toFixed(1)),
      }))
      .sort((a, b) => a.year - b.year)

    // Se não houver dados suficientes, retornar array vazio
    if (historicalData.length < 2) {
      return []
    }

    // Calcular tendência linear simples para previsão
    const calculateTrend = (values: number[]): { slope: number; intercept: number } => {
      const n = values.length
      const years = Array.from({ length: n }, (_, i) => historicalData[i].year)

      const sumX = years.reduce((acc, val) => acc + val, 0)
      const sumY = values.reduce((acc, val) => acc + val, 0)
      const sumXY = years.reduce((acc, val, i) => acc + val * values[i], 0)
      const sumXX = years.reduce((acc, val) => acc + val * val, 0)

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n

      return { slope, intercept }
    }

    // Extrair valores históricos para cada métrica
    const evasaoEmValues = historicalData.map((item) => item.evasao_em)
    const evasaoEm1Values = historicalData.map((item) => item.evasao_em_1_ano)
    const evasaoEm2Values = historicalData.map((item) => item.evasao_em_2_ano)
    const evasaoEm3Values = historicalData.map((item) => item.evasao_em_3_ano)

    // Calcular tendências
    const trendEm = calculateTrend(evasaoEmValues)
    const trendEm1 = calculateTrend(evasaoEm1Values)
    const trendEm2 = calculateTrend(evasaoEm2Values)
    const trendEm3 = calculateTrend(evasaoEm3Values)

    // Último ano nos dados
    const lastYear = historicalData[historicalData.length - 1].year

    // Gerar previsões para os próximos 5 anos
    const predictions = []
    for (let i = 1; i <= 5; i++) {
      const predictionYear = lastYear + i

      // Calcular valores previstos (com limite mínimo de 0)
      const predictedEm = Math.max(
        0,
        Number.parseFloat((trendEm.intercept + trendEm.slope * predictionYear).toFixed(1)),
      )
      const predictedEm1 = Math.max(
        0,
        Number.parseFloat((trendEm1.intercept + trendEm1.slope * predictionYear).toFixed(1)),
      )
      const predictedEm2 = Math.max(
        0,
        Number.parseFloat((trendEm2.intercept + trendEm2.slope * predictionYear).toFixed(1)),
      )
      const predictedEm3 = Math.max(
        0,
        Number.parseFloat((trendEm3.intercept + trendEm3.slope * predictionYear).toFixed(1)),
      )

      predictions.push({
        year: predictionYear,
        evasao_em: predictedEm,
        evasao_em_1_ano: predictedEm1,
        evasao_em_2_ano: predictedEm2,
        evasao_em_3_ano: predictedEm3,
        isPrediction: true,
      })
    }

    // Combinar dados históricos e previsões
    return [...historicalData.map((item) => ({ ...item, isPrediction: false })), ...predictions]
  },
)

// Função para calcular fatores de risco com base nos dados históricos
export const calculateRiskFactors = cache(async (): Promise<any[]> => {
  const data = await fetchIndicadoresEducacionais()

  // Agrupar por região para análise
  const regionMap = new Map<
    string,
    {
      count: number
      evasao_em_1_ano: number
      repetencia_em_1_ano: number
      promocao_em_1_ano: number
      migracao_eja_em_1_ano: number
    }
  >()

  data.forEach((item) => {
    if (!regionMap.has(item.regiao)) {
      regionMap.set(item.regiao, {
        count: 0,
        evasao_em_1_ano: 0,
        repetencia_em_1_ano: 0,
        promocao_em_1_ano: 0,
        migracao_eja_em_1_ano: 0,
      })
    }

    const regionData = regionMap.get(item.regiao)!
    regionData.count++
    regionData.evasao_em_1_ano += item.taxa_evasao_em_1_ano
    regionData.repetencia_em_1_ano += item.taxa_repetencia_em_1_ano
    regionData.promocao_em_1_ano += item.taxa_promocao_em_1_ano
    regionData.migracao_eja_em_1_ano += item.taxa_migracao_eja_em_1_ano
  })

  // Calcular médias e criar array de fatores de risco
  const riskFactors = []
  for (const [region, values] of regionMap.entries()) {
    const avgEvasao = values.evasao_em_1_ano / values.count
    const avgRepetencia = values.repetencia_em_1_ano / values.count
    const avgPromocao = values.promocao_em_1_ano / values.count
    const avgMigracaoEja = values.migracao_eja_em_1_ano / values.count

    // Calcular nível de risco (0-100) baseado na taxa de evasão
    const riskLevel = Math.min(100, Math.round((avgEvasao / 25) * 100))

    riskFactors.push({
      region,
      avgEvasao: Number.parseFloat(avgEvasao.toFixed(1)),
      avgRepetencia: Number.parseFloat(avgRepetencia.toFixed(1)),
      avgPromocao: Number.parseFloat(avgPromocao.toFixed(1)),
      avgMigracaoEja: Number.parseFloat(avgMigracaoEja.toFixed(1)),
      riskLevel,
      riskCategory: riskLevel < 30 ? "Baixo" : riskLevel < 60 ? "Médio" : "Alto",
    })
  }

  // Ordenar por nível de risco (decrescente)
  return riskFactors.sort((a, b) => b.riskLevel - a.riskLevel)
})

// Função para calcular o impacto estimado de intervenções
export const calculateInterventionImpact = cache(async (): Promise<any[]> => {
  const data = await fetchIndicadoresEducacionais()

  // Calcular médias nacionais
  let totalEvasao = 0
  let totalRepetencia = 0
  let count = 0

  data.forEach((item) => {
    totalEvasao += item.taxa_evasao_em
    totalRepetencia += item.taxa_repetencia_em
    count++
  })

  const avgEvasao = totalEvasao / count
  const avgRepetencia = totalRepetencia / count

  // Definir intervenções e seus impactos estimados
  const interventions = [
    {
      id: 1,
      name: "Programa de Tutoria Acadêmica",
      description: "Implementação de programas de tutoria para alunos com dificuldades de aprendizagem",
      estimatedReduction: 15, // Redução percentual estimada na taxa de evasão
      implementationCost: "Médio",
      timeToImpact: "Curto prazo (1 ano)",
      currentEvasao: avgEvasao,
      projectedEvasao: Number.parseFloat((avgEvasao * (1 - 0.15)).toFixed(1)),
      targetGroups: ["Alunos com baixo desempenho", "Repetentes"],
    },
    {
      id: 2,
      name: "Modernização do Currículo",
      description:
        "Atualização do currículo escolar para incluir habilidades práticas e relevantes para o mercado de trabalho",
      estimatedReduction: 10,
      implementationCost: "Alto",
      timeToImpact: "Médio prazo (2-3 anos)",
      currentEvasao: avgEvasao,
      projectedEvasao: Number.parseFloat((avgEvasao * (1 - 0.1)).toFixed(1)),
      targetGroups: ["Todos os alunos", "Especialmente 1º ano do EM"],
    },
    {
      id: 3,
      name: "Acompanhamento Psicossocial",
      description: "Oferta de suporte psicológico e social para estudantes em situação de vulnerabilidade",
      estimatedReduction: 20,
      implementationCost: "Médio",
      timeToImpact: "Curto prazo (1 ano)",
      currentEvasao: avgEvasao,
      projectedEvasao: Number.parseFloat((avgEvasao * (1 - 0.2)).toFixed(1)),
      targetGroups: ["Alunos em situação de vulnerabilidade", "Alunos com problemas familiares"],
    },
    {
      id: 4,
      name: "Programa de Recuperação Intensiva",
      description: "Aulas extras e material de apoio para alunos com dificuldades específicas",
      estimatedReduction: 12,
      implementationCost: "Baixo",
      timeToImpact: "Imediato",
      currentEvasao: avgEvasao,
      projectedEvasao: Number.parseFloat((avgEvasao * (1 - 0.12)).toFixed(1)),
      targetGroups: ["Alunos com notas baixas", "Alunos em risco de repetência"],
    },
    {
      id: 5,
      name: "Integração Escola-Família",
      description: "Programa de envolvimento dos pais e responsáveis no processo educacional",
      estimatedReduction: 8,
      implementationCost: "Baixo",
      timeToImpact: "Médio prazo (2 anos)",
      currentEvasao: avgEvasao,
      projectedEvasao: Number.parseFloat((avgEvasao * (1 - 0.08)).toFixed(1)),
      targetGroups: ["Todos os alunos", "Famílias de baixa renda"],
    },
  ]

  return interventions
})

// Função para obter casos de sucesso baseados nos dados
export const getSuccessCases = cache(async (): Promise<any[]> => {
  const data = await fetchIndicadoresEducacionais()

  // Agrupar por região, ano e rede
  const successMap = new Map<
    string,
    {
      region: string
      year: string
      network: string
      evasao: number
      repetencia: number
      promocao: number
      count: number
    }
  >()

  data.forEach((item) => {
    const key = `${item.regiao}-${item.ano}-${item.rede}`

    if (!successMap.has(key)) {
      successMap.set(key, {
        region: item.regiao,
        year: item.ano,
        network: item.rede,
        evasao: 0,
        repetencia: 0,
        promocao: 0,
        count: 0,
      })
    }

    const caseData = successMap.get(key)!
    caseData.evasao += item.taxa_evasao_em
    caseData.repetencia += item.taxa_repetencia_em
    caseData.promocao += item.taxa_promocao_em
    caseData.count++
  })

  // Calcular médias e converter para array
  const successCases = Array.from(successMap.values()).map((item) => ({
    region: item.region,
    year: item.year,
    network: item.network,
    evasao: Number.parseFloat((item.evasao / item.count).toFixed(1)),
    repetencia: Number.parseFloat((item.repetencia / item.count).toFixed(1)),
    promocao: Number.parseFloat((item.promocao / item.count).toFixed(1)),
  }))

  // Filtrar casos de sucesso (baixa evasão e alta promoção)
  const filteredCases = successCases.filter((item) => item.evasao < 10 && item.promocao > 80)

  // Ordenar por taxa de evasão (crescente)
  return filteredCases.sort((a, b) => a.evasao - b.evasao).slice(0, 5) // Retornar apenas os 5 melhores casos
})

// Function to generate recommendations based on region
export const generateRecommendations = cache(async (region: string): Promise<any[]> => {
  // This is a placeholder - replace with actual logic to generate recommendations
  // based on the region and potentially other factors.
  const recommendations = [
    {
      id: 1,
      title: "Implementar programa de tutoria",
      description: "Oferecer apoio individualizado aos alunos com dificuldades.",
      category: "curto_prazo",
      timeframe: "3-6 meses",
      impact: "alto",
      difficulty: "média",
    },
    {
      id: 2,
      title: "Modernizar o currículo escolar",
      description: "Tornar o currículo mais relevante para o mercado de trabalho.",
      category: "medio_prazo",
      timeframe: "1-2 anos",
      impact: "médio",
      difficulty: "alta",
    },
    {
      id: 3,
      title: "Fortalecer a ligação escola-família",
      description: "Envolver os pais no processo educativo.",
      category: "longo_prazo",
      timeframe: "2-5 anos",
      impact: "muito alto",
      difficulty: "baixa",
    },
  ]

  return recommendations
})

// Function to identify risk factors
export const identifyRiskFactors = cache(async (): Promise<any[]> => {
  // This is a placeholder - replace with actual logic to identify risk factors
  // based on the region and potentially other factors.
  const riskFactors = [
    {
      region: "Norte",
      avgEvasao: 15.2,
      riskLevel: "alto",
      avgRepetencia: 8.5,
      repetenciaCorrelation: "alta",
      avgPromocao: 75.3,
      promocaoCorrelation: "baixa",
    },
    {
      region: "Nordeste",
      avgEvasao: 12.8,
      riskLevel: "médio",
      avgRepetencia: 7.2,
      repetenciaCorrelation: "média",
      avgPromocao: 78.0,
      promocaoCorrelation: "média",
    },
    {
      region: "Sudeste",
      avgEvasao: 8.5,
      riskLevel: "baixo",
      avgRepetencia: 5.1,
      repetenciaCorrelation: "baixa",
      avgPromocao: 85.4,
      promocaoCorrelation: "alta",
    },
  ]

  return riskFactors
})
