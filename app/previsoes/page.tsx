"use client"

import { useState } from "react"
import { Filter } from "lucide-react"

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
import { PredictionChart } from "@/components/prediction-chart"
import { RiskFactors } from "@/components/risk-factors"

export default function PrevisaoPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("Todas")
  const [selectedLocation, setSelectedLocation] = useState<string>("Todas")
  const [selectedNetwork, setSelectedNetwork] = useState<string>("Todas")

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Previsões de Evasão Escolar</h1>
          <p className="text-muted-foreground">
            Análise preditiva das tendências de evasão escolar para os próximos anos
          </p>
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
                {["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"].map((region) => (
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
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Localização</DropdownMenuLabel>
                <DropdownMenuItem
                  className={selectedLocation === "Todas" ? "bg-muted" : ""}
                  onClick={() => setSelectedLocation("Todas")}
                >
                  Todas
                </DropdownMenuItem>
                {["urbana", "rural", "total"].map((location) => (
                  <DropdownMenuItem
                    key={location}
                    className={selectedLocation === location ? "bg-muted" : ""}
                    onClick={() => setSelectedLocation(location)}
                  >
                    {location.charAt(0).toUpperCase() + location.slice(1)}
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
                {["estadual", "federal", "municipal", "privada", "publica", "total"].map((network) => (
                  <DropdownMenuItem
                    key={network}
                    className={selectedNetwork === network ? "bg-muted" : ""}
                    onClick={() => setSelectedNetwork(network)}
                  >
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Previsão de Evasão Escolar</CardTitle>
            <CardDescription>
              Projeção das taxas de evasão escolar para os próximos 5 anos com base em tendências históricas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PredictionChart region={selectedRegion} location={selectedLocation} network={selectedNetwork} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise de Fatores de Risco</CardTitle>
            <CardDescription>
              Avaliação dos fatores de risco de evasão escolar por região com base nos dados históricos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="risk" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="risk">Fatores de Risco</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              <TabsContent value="risk" className="mt-4">
                <RiskFactors />
              </TabsContent>
              <TabsContent value="insights" className="mt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Principais Insights</h3>
                    <ul className="ml-6 list-disc space-y-2">
                      <li>
                        O 1º ano do Ensino Médio apresenta as maiores taxas de evasão, indicando um período crítico de
                        transição do Ensino Fundamental para o Médio.
                      </li>
                      <li>
                        Regiões com maiores taxas de repetência tendem a apresentar maiores taxas de evasão no ano
                        seguinte, sugerindo uma forte correlação entre esses indicadores.
                      </li>
                      <li>
                        A tendência geral mostra uma leve redução nas taxas de evasão nos últimos anos, mas com
                        disparidades significativas entre as regiões.
                      </li>
                      <li>
                        Escolas da rede federal apresentam, em média, menores taxas de evasão, sugerindo práticas que
                        poderiam ser replicadas em outras redes.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium">Fatores Correlacionados</h3>
                    <div className="rounded-lg bg-muted p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium">Fatores de Alto Impacto</h4>
                          <ul className="ml-5 mt-2 list-disc text-sm text-muted-foreground">
                            <li>Taxa de repetência no ano anterior</li>
                            <li>Transição entre níveis de ensino</li>
                            <li>Localização da escola (urbana/rural)</li>
                            <li>Tipo de rede de ensino</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">Fatores de Médio Impacto</h4>
                          <ul className="ml-5 mt-2 list-disc text-sm text-muted-foreground">
                            <li>Região geográfica</li>
                            <li>Taxa de migração para EJA</li>
                            <li>Ano letivo (tendências temporais)</li>
                            <li>Políticas educacionais implementadas</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metodologia de Previsão</CardTitle>
            <CardDescription>
              Entenda como são calculadas as previsões de evasão escolar apresentadas nesta página
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                As previsões apresentadas nesta página são baseadas em um modelo de regressão linear simples aplicado
                aos dados históricos de evasão escolar disponíveis no dataset do INEP. O modelo considera as tendências
                observadas nos últimos anos para projetar as taxas futuras.
              </p>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 text-sm font-medium">Limitações do Modelo</h3>
                <ul className="ml-5 list-disc text-sm text-muted-foreground">
                  <li>
                    O modelo não considera fatores externos como mudanças econômicas, políticas educacionais ou eventos
                    disruptivos (como pandemias).
                  </li>
                  <li>
                    As previsões são mais precisas para o curto prazo (1-2 anos) e tendem a perder precisão para
                    horizontes mais longos.
                  </li>
                  <li>
                    O modelo assume que as tendências passadas continuarão no futuro, o que nem sempre é verdadeiro.
                  </li>
                </ul>
              </div>

              <p>
                Para uma análise mais completa, recomendamos considerar estas previsões em conjunto com outros
                indicadores educacionais e fatores contextuais específicos de cada região e rede de ensino.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
