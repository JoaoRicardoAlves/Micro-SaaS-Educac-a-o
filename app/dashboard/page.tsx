"use client"

import { useEffect, useState } from "react"
import { Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EvasaoBarChart } from "@/components/evasao-bar-chart"
import { EvasaoLineChart } from "@/components/evasao-line-chart"
import { EvasaoMap } from "@/components/evasao-map"
import { EvasaoTable } from "@/components/evasao-table"
import { KpiCards } from "@/components/kpi-cards"
import { getYearsFromData, getRegionsFromData, getLocationsFromData, getNetworksFromData } from "@/lib/data"

export default function DashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("Todas")
  const [selectedYear, setSelectedYear] = useState<string>("2016")
  const [selectedLocation, setSelectedLocation] = useState<string>("Todas")
  const [selectedNetwork, setSelectedNetwork] = useState<string>("Todas")

  const [years, setYears] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [networks, setNetworks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFilterOptions() {
      setLoading(true)
      try {
        const [yearsData, regionsData, locationsData, networksData] = await Promise.all([
          getYearsFromData(),
          getRegionsFromData(),
          getLocationsFromData(),
          getNetworksFromData(),
        ])

        setYears(yearsData)
        setRegions(regionsData)
        setLocations(locationsData)
        setNetworks(networksData)

        // Definir valores padrão se disponíveis
        if (yearsData.length > 0) {
          setSelectedYear(yearsData[yearsData.length - 1]) // Último ano disponível
        }
      } catch (error) {
        console.error("Erro ao carregar opções de filtro:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFilterOptions()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex h-[60vh] w-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <h2 className="text-xl font-medium">Carregando dados...</h2>
            <p className="text-muted-foreground">Aguarde enquanto processamos os dados educacionais</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Evasão Escolar</h1>
          <p className="text-muted-foreground">Visualize e analise os dados de evasão escolar no ensino médio</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filtros</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Região</DropdownMenuLabel>
                <DropdownMenuItem
                  className={selectedRegion === "Todas" ? "bg-muted" : ""}
                  onClick={() => setSelectedRegion("Todas")}
                >
                  Todas
                </DropdownMenuItem>
                {regions.map((region) => (
                  <DropdownMenuItem
                    key={region}
                    className={selectedRegion === region ? "bg-muted" : ""}
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Ano</DropdownMenuLabel>
                {years.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    className={selectedYear === year ? "bg-muted" : ""}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Localização</DropdownMenuLabel>
                <DropdownMenuItem
                  className={selectedLocation === "Todas" ? "bg-muted" : ""}
                  onClick={() => setSelectedLocation("Todas")}
                >
                  Todas
                </DropdownMenuItem>
                {locations.map((location) => (
                  <DropdownMenuItem
                    key={location}
                    className={selectedLocation === location ? "bg-muted" : ""}
                    onClick={() => setSelectedLocation(location)}
                  >
                    {location}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Rede</DropdownMenuLabel>
                <DropdownMenuItem
                  className={selectedNetwork === "Todas" ? "bg-muted" : ""}
                  onClick={() => setSelectedNetwork("Todas")}
                >
                  Todas
                </DropdownMenuItem>
                {networks.map((network) => (
                  <DropdownMenuItem
                    key={network}
                    className={selectedNetwork === network ? "bg-muted" : ""}
                    onClick={() => setSelectedNetwork(network)}
                  >
                    {network}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <KpiCards region={selectedRegion} year={selectedYear} location={selectedLocation} network={selectedNetwork} />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Taxa de Evasão por Região</CardTitle>
              <CardDescription>
                Comparação da taxa de evasão entre as regiões do Brasil em {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EvasaoBarChart year={selectedYear} location={selectedLocation} network={selectedNetwork} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Evolução da Evasão ao Longo do Tempo</CardTitle>
              <CardDescription>Tendência da taxa de evasão no ensino médio</CardDescription>
            </CardHeader>
            <CardContent>
              <EvasaoLineChart region={selectedRegion} location={selectedLocation} network={selectedNetwork} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mapa de Evasão Escolar</CardTitle>
            <CardDescription>Distribuição geográfica da evasão escolar no Brasil em {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <EvasaoMap year={selectedYear} location={selectedLocation} network={selectedNetwork} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Detalhados</CardTitle>
            <CardDescription>Tabela com dados detalhados de evasão escolar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="evasao" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="evasao">Evasão</TabsTrigger>
                <TabsTrigger value="repetencia">Repetência</TabsTrigger>
                <TabsTrigger value="promocao">Promoção</TabsTrigger>
                <TabsTrigger value="eja">Migração EJA</TabsTrigger>
              </TabsList>
              <TabsContent value="evasao" className="mt-4">
                <EvasaoTable
                  type="evasao"
                  region={selectedRegion}
                  year={selectedYear}
                  location={selectedLocation}
                  network={selectedNetwork}
                />
              </TabsContent>
              <TabsContent value="repetencia" className="mt-4">
                <EvasaoTable
                  type="repetencia"
                  region={selectedRegion}
                  year={selectedYear}
                  location={selectedLocation}
                  network={selectedNetwork}
                />
              </TabsContent>
              <TabsContent value="promocao" className="mt-4">
                <EvasaoTable
                  type="promocao"
                  region={selectedRegion}
                  year={selectedYear}
                  location={selectedLocation}
                  network={selectedNetwork}
                />
              </TabsContent>
              <TabsContent value="eja" className="mt-4">
                <EvasaoTable
                  type="eja"
                  region={selectedRegion}
                  year={selectedYear}
                  location={selectedLocation}
                  network={selectedNetwork}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
