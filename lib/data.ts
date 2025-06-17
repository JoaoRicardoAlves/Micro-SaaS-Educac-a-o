"use server"

import { cache } from "react"

export interface IndicadorEducacional {
  ano: string
  regiao: string
  localizacao: string
  rede: string
  taxa_promocao_ef: number
  taxa_promocao_ef_anos_iniciais: number
  taxa_promocao_ef_anos_finais: number
  taxa_promocao_ef_1_ano: number
  taxa_promocao_ef_2_ano: number
  taxa_promocao_ef_3_ano: number
  taxa_promocao_ef_4_ano: number
  taxa_promocao_ef_5_ano: number
  taxa_promocao_ef_6_ano: number
  taxa_promocao_ef_7_ano: number
  taxa_promocao_ef_8_ano: number
  taxa_promocao_ef_9_ano: number
  taxa_promocao_em: number
  taxa_promocao_em_1_ano: number
  taxa_promocao_em_2_ano: number
  taxa_promocao_em_3_ano: number
  taxa_repetencia_ef: number
  taxa_repetencia_ef_anos_iniciais: number
  taxa_repetencia_ef_anos_finais: number
  taxa_repetencia_ef_1_ano: number
  taxa_repetencia_ef_2_ano: number
  taxa_repetencia_ef_3_ano: number
  taxa_repetencia_ef_4_ano: number
  taxa_repetencia_ef_5_ano: number
  taxa_repetencia_ef_6_ano: number
  taxa_repetencia_ef_7_ano: number
  taxa_repetencia_ef_8_ano: number
  taxa_repetencia_ef_9_ano: number
  taxa_repetencia_em: number
  taxa_repetencia_em_1_ano: number
  taxa_repetencia_em_2_ano: number
  taxa_repetencia_em_3_ano: number
  taxa_evasao_ef: number
  taxa_evasao_ef_anos_iniciais: number
  taxa_evasao_ef_anos_finais: number
  taxa_evasao_ef_1_ano: number
  taxa_evasao_ef_2_ano: number
  taxa_evasao_ef_3_ano: number
  taxa_evasao_ef_4_ano: number
  taxa_evasao_ef_5_ano: number
  taxa_evasao_ef_6_ano: number
  taxa_evasao_ef_7_ano: number
  taxa_evasao_ef_8_ano: number
  taxa_evasao_ef_9_ano: number
  taxa_evasao_em: number
  taxa_evasao_em_1_ano: number
  taxa_evasao_em_2_ano: number
  taxa_evasao_em_3_ano: number
  taxa_migracao_eja_ef: number
  taxa_migracao_eja_ef_anos_iniciais: number
  taxa_migracao_eja_ef_anos_finais: number
  taxa_migracao_eja_ef_1_ano: number
  taxa_migracao_eja_ef_2_ano: number
  taxa_migracao_eja_ef_3_ano: number
  taxa_migracao_eja_ef_4_ano: number
  taxa_migracao_eja_ef_5_ano: number
  taxa_migracao_eja_ef_6_ano: number
  taxa_migracao_eja_ef_7_ano: number
  taxa_migracao_eja_ef_8_ano: number
  taxa_migracao_eja_ef_9_ano: number
  taxa_migracao_eja_em: number
  taxa_migracao_eja_em_1_ano: number
  taxa_migracao_eja_em_2_ano: number
  taxa_migracao_eja_em_3_ano: number
}

// Alterar a constante CSV_URL para usar a API que criamos
const CSV_URL = "/api/csv"

// Função para converter string para número, tratando valores inválidos
function parseNumber(value: string): number {
  const parsed = Number.parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

// Modificar a função fetchIndicadoresEducacionais para incluir melhor tratamento de erros e logging
export const fetchIndicadoresEducacionais = cache(async (): Promise<IndicadorEducacional[]> => {
  try {
    console.log("Tentando carregar o arquivo CSV de:", CSV_URL)
    const response = await fetch(CSV_URL, {
      cache: "no-store", // Desabilitar cache para garantir que sempre pegamos a versão mais recente
    })

    if (!response.ok) {
      console.error(`Erro ao carregar o arquivo CSV: ${response.status} ${response.statusText}`)
      throw new Error(`Erro ao carregar o arquivo CSV: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("CSV carregado, primeiros 100 caracteres:", csvText.substring(0, 100))

    if (!csvText || csvText.trim() === "") {
      console.error("Arquivo CSV vazio ou inválido")
      return []
    }

    const rows = csvText.split("\n")
    console.log(`Número de linhas no CSV: ${rows.length}`)

    if (rows.length <= 1) {
      console.error("CSV não contém dados suficientes")
      return []
    }

    const headers = rows[0].split(",")
    console.log(`Cabeçalhos encontrados: ${headers.join(", ")}`)

    const data: IndicadorEducacional[] = []

    // Começar do índice 1 para pular o cabeçalho
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue // Pular linhas vazias

      const values = rows[i].split(",")
      if (values.length !== headers.length) {
        console.warn(`Linha ${i} tem ${values.length} valores, esperado ${headers.length}. Pulando.`)
        continue // Pular linhas com número incorreto de colunas
      }

      const row: any = {}

      // Mapear valores para as propriedades
      headers.forEach((header, index) => {
        const value = values[index].trim()

        // Converter para número se for um campo numérico
        if (header.startsWith("taxa_")) {
          row[header] = parseNumber(value)
        } else {
          row[header] = value
        }
      })

      data.push(row as IndicadorEducacional)
    }

    console.log(`Processados ${data.length} registros do CSV`)
    return data
  } catch (error) {
    console.error("Erro ao processar dados:", error)
    return []
  }
})

// Função para obter anos únicos dos dados
export async function getYearsFromData(): Promise<string[]> {
  const data = await fetchIndicadoresEducacionais()
  const yearsSet = new Set<string>()

  data.forEach((item) => {
    if (item.ano) {
      yearsSet.add(item.ano)
    }
  })

  return Array.from(yearsSet).sort()
}

// Função para obter regiões únicas dos dados
export async function getRegionsFromData(): Promise<string[]> {
  const data = await fetchIndicadoresEducacionais()
  const regionsSet = new Set<string>()

  data.forEach((item) => {
    if (item.regiao) {
      regionsSet.add(item.regiao)
    }
  })

  return Array.from(regionsSet).sort()
}

// Função para obter localizações únicas dos dados
export async function getLocationsFromData(): Promise<string[]> {
  const data = await fetchIndicadoresEducacionais()
  const locationsSet = new Set<string>()

  data.forEach((item) => {
    if (item.localizacao) {
      locationsSet.add(item.localizacao)
    }
  })

  return Array.from(locationsSet).sort()
}

// Função para obter redes únicas dos dados
export async function getNetworksFromData(): Promise<string[]> {
  const data = await fetchIndicadoresEducacionais()
  const networksSet = new Set<string>()

  data.forEach((item) => {
    if (item.rede) {
      networksSet.add(item.rede)
    }
  })

  return Array.from(networksSet).sort()
}

// Função para filtrar dados com base nos critérios
export async function filterData(
  year?: string,
  region?: string,
  location?: string,
  network?: string,
): Promise<IndicadorEducacional[]> {
  const data = await fetchIndicadoresEducacionais()

  return data.filter((item) => {
    if (year && item.ano !== year) return false
    if (region && region !== "Todas" && item.regiao !== region) return false
    if (location && location !== "Todas" && item.localizacao !== location) return false
    if (network && network !== "Todas" && item.rede !== network) return false
    return true
  })
}

// Função para calcular médias por região
export async function getAverageByRegion(year?: string, location?: string, network?: string): Promise<any[]> {
  const data = await filterData(year, undefined, location, network)

  const regionMap = new Map<
    string,
    {
      count: number
      taxa_evasao_em_1_ano: number
      taxa_evasao_em_2_ano: number
      taxa_evasao_em_3_ano: number
    }
  >()

  data.forEach((item) => {
    if (!regionMap.has(item.regiao)) {
      regionMap.set(item.regiao, {
        count: 0,
        taxa_evasao_em_1_ano: 0,
        taxa_evasao_em_2_ano: 0,
        taxa_evasao_em_3_ano: 0,
      })
    }

    const regionData = regionMap.get(item.regiao)!
    regionData.count++
    regionData.taxa_evasao_em_1_ano += item.taxa_evasao_em_1_ano
    regionData.taxa_evasao_em_2_ano += item.taxa_evasao_em_2_ano
    regionData.taxa_evasao_em_3_ano += item.taxa_evasao_em_3_ano
  })

  const result = []
  for (const [region, values] of regionMap.entries()) {
    result.push({
      name: region,
      "1º Ano": Number.parseFloat((values.taxa_evasao_em_1_ano / values.count).toFixed(1)),
      "2º Ano": Number.parseFloat((values.taxa_evasao_em_2_ano / values.count).toFixed(1)),
      "3º Ano": Number.parseFloat((values.taxa_evasao_em_3_ano / values.count).toFixed(1)),
    })
  }

  return result
}

// Função para obter dados de evasão ao longo do tempo
export async function getEvasaoOverTime(region?: string, location?: string, network?: string): Promise<any[]> {
  const data = await filterData(undefined, region, location, network)

  const yearMap = new Map<
    string,
    {
      count: number
      evasao: number
    }
  >()

  data.forEach((item) => {
    if (!yearMap.has(item.ano)) {
      yearMap.set(item.ano, {
        count: 0,
        evasao: 0,
      })
    }

    const yearData = yearMap.get(item.ano)!
    yearData.count++
    yearData.evasao += item.taxa_evasao_em
  })

  const result = []
  for (const [year, values] of yearMap.entries()) {
    result.push({
      year,
      evasao: Number.parseFloat((values.evasao / values.count).toFixed(1)),
    })
  }

  // Ordenar por ano
  return result.sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))
}

// Função para obter dados detalhados de evasão
export async function getDetailedEvasaoData(
  type: "evasao" | "repetencia" | "promocao" | "eja",
  region?: string,
  year?: string,
  location?: string,
  network?: string,
): Promise<any[]> {
  const data = await filterData(year, undefined, location, network)

  const regionMap = new Map<
    string,
    {
      count: number
      ef: number
      em_1: number
      em_2: number
      em_3: number
      em_total: number
    }
  >()

  // Inicializar com todas as regiões para garantir que todas apareçam
  const allRegions = await getRegionsFromData()
  allRegions.forEach((region) => {
    regionMap.set(region, {
      count: 0,
      ef: 0,
      em_1: 0,
      em_2: 0,
      em_3: 0,
      em_total: 0,
    })
  })

  // Adicionar "Brasil" para média nacional
  regionMap.set("Brasil", {
    count: 0,
    ef: 0,
    em_1: 0,
    em_2: 0,
    em_3: 0,
    em_total: 0,
  })

  data.forEach((item) => {
    const regionData = regionMap.get(item.regiao)!
    regionData.count++

    // Selecionar os campos corretos com base no tipo
    if (type === "evasao") {
      regionData.ef += item.taxa_evasao_ef
      regionData.em_1 += item.taxa_evasao_em_1_ano
      regionData.em_2 += item.taxa_evasao_em_2_ano
      regionData.em_3 += item.taxa_evasao_em_3_ano
      regionData.em_total += item.taxa_evasao_em

      // Adicionar à média nacional
      const brasilData = regionMap.get("Brasil")!
      brasilData.count++
      brasilData.ef += item.taxa_evasao_ef
      brasilData.em_1 += item.taxa_evasao_em_1_ano
      brasilData.em_2 += item.taxa_evasao_em_2_ano
      brasilData.em_3 += item.taxa_evasao_em_3_ano
      brasilData.em_total += item.taxa_evasao_em
    } else if (type === "repetencia") {
      regionData.ef += item.taxa_repetencia_ef
      regionData.em_1 += item.taxa_repetencia_em_1_ano
      regionData.em_2 += item.taxa_repetencia_em_2_ano
      regionData.em_3 += item.taxa_repetencia_em_3_ano
      regionData.em_total += item.taxa_repetencia_em

      // Adicionar à média nacional
      const brasilData = regionMap.get("Brasil")!
      brasilData.count++
      brasilData.ef += item.taxa_repetencia_ef
      brasilData.em_1 += item.taxa_repetencia_em_1_ano
      brasilData.em_2 += item.taxa_repetencia_em_2_ano
      brasilData.em_3 += item.taxa_repetencia_em_3_ano
      brasilData.em_total += item.taxa_repetencia_em
    } else if (type === "promocao") {
      regionData.ef += item.taxa_promocao_ef
      regionData.em_1 += item.taxa_promocao_em_1_ano
      regionData.em_2 += item.taxa_promocao_em_2_ano
      regionData.em_3 += item.taxa_promocao_em_3_ano
      regionData.em_total += item.taxa_promocao_em

      // Adicionar à média nacional
      const brasilData = regionMap.get("Brasil")!
      brasilData.count++
      brasilData.ef += item.taxa_promocao_ef
      brasilData.em_1 += item.taxa_promocao_em_1_ano
      brasilData.em_2 += item.taxa_promocao_em_2_ano
      brasilData.em_3 += item.taxa_promocao_em_3_ano
      brasilData.em_total += item.taxa_promocao_em
    } else if (type === "eja") {
      regionData.ef += item.taxa_migracao_eja_ef
      regionData.em_1 += item.taxa_migracao_eja_em_1_ano
      regionData.em_2 += item.taxa_migracao_eja_em_2_ano
      regionData.em_3 += item.taxa_migracao_eja_em_3_ano
      regionData.em_total += item.taxa_migracao_eja_em

      // Adicionar à média nacional
      const brasilData = regionMap.get("Brasil")!
      brasilData.count++
      brasilData.ef += item.taxa_migracao_eja_ef
      brasilData.em_1 += item.taxa_migracao_eja_em_1_ano
      brasilData.em_2 += item.taxa_migracao_eja_em_2_ano
      brasilData.em_3 += item.taxa_migracao_eja_em_3_ano
      brasilData.em_total += item.taxa_migracao_eja_em
    }
  })

  const result = []
  for (const [regionName, values] of regionMap.entries()) {
    // Pular regiões sem dados
    if (values.count === 0) continue

    // Filtrar por região específica se solicitado
    if (region && region !== "Todas" && regionName !== region && regionName !== "Brasil") continue

    result.push({
      regiao: regionName,
      ef: Number.parseFloat((values.ef / values.count).toFixed(1)),
      em_1: Number.parseFloat((values.em_1 / values.count).toFixed(1)),
      em_2: Number.parseFloat((values.em_2 / values.count).toFixed(1)),
      em_3: Number.parseFloat((values.em_3 / values.count).toFixed(1)),
      em_total: Number.parseFloat((values.em_total / values.count).toFixed(1)),
    })
  }

  return result
}

// Função para obter KPIs principais
export async function getKPIs(region?: string, year?: string, location?: string, network?: string): Promise<any> {
  const data = await filterData(year, region, location, network)

  if (data.length === 0) {
    return {
      taxaMedia: 0,
      regiaoMaior: "N/A",
      anoCritico: "N/A",
      tendenciaMelhoria: false,
    }
  }

  // Calcular taxa média de evasão
  let totalEvasao = 0
  data.forEach((item) => {
    totalEvasao += item.taxa_evasao_em
  })
  const taxaMedia = Number.parseFloat((totalEvasao / data.length).toFixed(1))

  // Encontrar região com maior evasão
  const evasaoPorRegiao = new Map<string, { total: number; count: number }>()
  data.forEach((item) => {
    if (!evasaoPorRegiao.has(item.regiao)) {
      evasaoPorRegiao.set(item.regiao, { total: 0, count: 0 })
    }
    const regionData = evasaoPorRegiao.get(item.regiao)!
    regionData.total += item.taxa_evasao_em
    regionData.count++
  })

  let regiaoMaior = ""
  let maiorTaxa = 0
  for (const [region, values] of evasaoPorRegiao.entries()) {
    const media = values.total / values.count
    if (media > maiorTaxa) {
      maiorTaxa = media
      regiaoMaior = region
    }
  }

  // Encontrar ano crítico (com maior evasão)
  const evasaoPorAno = new Map<string, { total: number; count: number }>()
  data.forEach((item) => {
    if (!evasaoPorAno.has(item.ano)) {
      evasaoPorAno.set(item.ano, { total: 0, count: 0 })
    }
    const yearData = evasaoPorAno.get(item.ano)!
    yearData.total += item.taxa_evasao_em
    yearData.count++
  })

  let anoCritico = ""
  let maiorTaxaAno = 0
  for (const [year, values] of evasaoPorAno.entries()) {
    const media = values.total / values.count
    if (media > maiorTaxaAno) {
      maiorTaxaAno = media
      anoCritico = year
    }
  }

  // Verificar tendência de melhoria
  // Ordenar anos e verificar se a taxa está diminuindo nos últimos anos
  const anos = Array.from(evasaoPorAno.keys()).sort()
  const tendenciaMelhoria =
    anos.length >= 2 &&
    evasaoPorAno.get(anos[anos.length - 1])!.total / evasaoPorAno.get(anos[anos.length - 1])!.count <
      evasaoPorAno.get(anos[anos.length - 2])!.total / evasaoPorAno.get(anos[anos.length - 2])!.count

  return {
    taxaMedia,
    regiaoMaior,
    anoCritico,
    tendenciaMelhoria,
  }
}
