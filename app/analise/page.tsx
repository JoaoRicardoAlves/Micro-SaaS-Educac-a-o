"use client"

import { useState } from "react"
import { Filter, Download } from "lucide-react"

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
import { AnalysisTable } from "@/components/analysis-table"
import { ComparisonChart } from "@/components/comparison-chart"
import { CorrelationChart } from "@/components/correlation-chart"
import { TrendAnalysis } from "@/components/trend-analysis"

export default function AnalisePage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("Todas")
  const [selectedYear, setSelectedYear] = useState<string>("2016")
  const [selectedPrevYear, setSelectedPrevYear] = useState<string>("2015")
  const [selectedMetric, setSelectedMetric] = useState<string>("taxa_evasao_em")

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Análise de Evasão Escolar</h1>
          <p className="text-muted-foreground">
            Análise detalhada dos indicadores educacionais relacionados à evasão escolar
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
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Ano</DropdownMenuLabel>
                {["2013", "2014", "2015", "2016"].map((year) => (
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
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Ano Anterior
                </DropdownMenuLabel>
                {["2012", "2013", "2014", "2015"].map((year) => (
                  <DropdownMenuItem
                    key={year}
                    className={selectedPrevYear === year ? "bg-muted" : ""}
                    onClick={() => setSelectedPrevYear(year)}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Métrica</DropdownMenuLabel>
                <DropdownMenuItem
                  className={selectedMetric === "taxa_evasao_em" ? "bg-muted" : ""}
                  onClick={() => setSelectedMetric("taxa_evasao_em")}
                >
                  Taxa de Evasão
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={selectedMetric === "taxa_repetencia_em" ? "bg-muted" : ""}
                  onClick={() => setSelectedMetric("taxa_repetencia_em")}
                >
                  Taxa de Repetência
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={selectedMetric === "taxa_promocao_em" ? "bg-muted" : ""}
                  onClick={() => setSelectedMetric("taxa_promocao_em")}
                >
                  Taxa de Promoção
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={selectedMetric === "taxa_migracao_eja_em" ? "bg-muted" : ""}
                  onClick={() => setSelectedMetric("taxa_migracao_eja_em")}
                >
                  Taxa de Migração para EJA
                </DropdownMenuItem>
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
        <Card>
          <CardHeader>
            <CardTitle>Análise Comparativa</CardTitle>
            <CardDescription>
              Comparação de indicadores educacionais por diferentes categorias no ano {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="region" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="region">Por Região</TabsTrigger>
                <TabsTrigger value="network">Por Rede de Ensino</TabsTrigger>
                <TabsTrigger value="location">Por Localização</TabsTrigger>
              </TabsList>
              <TabsContent value="region" className="mt-4">
                <ComparisonChart metric={selectedMetric} compareBy="region" year={selectedYear} />
              </TabsContent>
              <TabsContent value="network" className="mt-4">
                <ComparisonChart metric={selectedMetric} compareBy="network" year={selectedYear} />
              </TabsContent>
              <TabsContent value="location" className="mt-4">
                <ComparisonChart metric={selectedMetric} compareBy="location" year={selectedYear} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise de Tendências</CardTitle>
            <CardDescription>
              Evolução dos indicadores educacionais ao longo do tempo{" "}
              {selectedRegion !== "Todas" && `na região ${selectedRegion}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendAnalysis metric={selectedMetric} region={selectedRegion !== "Todas" ? selectedRegion : undefined} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise de Correlação</CardTitle>
            <CardDescription>Relação entre diferentes indicadores educacionais no ano {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="evasao-repetencia" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="evasao-repetencia">Evasão x Repetência</TabsTrigger>
                <TabsTrigger value="evasao-promocao">Evasão x Promoção</TabsTrigger>
                <TabsTrigger value="evasao-eja">Evasão x Migração EJA</TabsTrigger>
              </TabsList>
              <TabsContent value="evasao-repetencia" className="mt-4">
                <CorrelationChart
                  xMetric="taxa_evasao_em"
                  yMetric="taxa_repetencia_em"
                  region={selectedRegion !== "Todas" ? selectedRegion : undefined}
                  year={selectedYear}
                />
              </TabsContent>
              <TabsContent value="evasao-promocao" className="mt-4">
                <CorrelationChart
                  xMetric="taxa_evasao_em"
                  yMetric="taxa_promocao_em"
                  region={selectedRegion !== "Todas" ? selectedRegion : undefined}
                  year={selectedYear}
                />
              </TabsContent>
              <TabsContent value="evasao-eja" className="mt-4">
                <CorrelationChart
                  xMetric="taxa_evasao_em"
                  yMetric="taxa_migracao_eja_em"
                  region={selectedRegion !== "Todas" ? selectedRegion : undefined}
                  year={selectedYear}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Detalhados</CardTitle>
            <CardDescription>
              Tabela com dados detalhados por região e rede de ensino, comparando {selectedYear} com {selectedPrevYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalysisTable metric={selectedMetric} year={selectedYear} prevYear={selectedPrevYear} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Principais Insights</CardTitle>
            <CardDescription>Conclusões e observações importantes baseadas na análise dos dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-medium">Correlações Identificadas</h3>
                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    <span className="font-medium">Evasão e Repetência:</span> Existe uma forte correlação positiva entre
                    as taxas de repetência e as taxas de evasão no ano seguinte, sugerindo que alunos repetentes têm
                    maior probabilidade de abandonar a escola.
                  </li>
                  <li>
                    <span className="font-medium">Evasão e Promoção:</span> Há uma correlação negativa entre as taxas de
                    promoção e evasão, indicando que escolas com melhores taxas de aprovação tendem a ter menor evasão.
                  </li>
                  <li>
                    <span className="font-medium">Transição para EJA:</span> A migração para EJA é mais frequente em
                    regiões com altas taxas de repetência, sugerindo que esta é uma alternativa buscada por alunos com
                    histórico de reprovações.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">Disparidades Regionais</h3>
                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-2">
                    As regiões Norte e Nordeste apresentam, em média, taxas de evasão significativamente mais altas que
                    as regiões Sul e Sudeste, refletindo desigualdades socioeconômicas e educacionais históricas.
                  </p>
                  <ul className="ml-5 mt-2 list-disc text-sm text-muted-foreground">
                    <li>
                      Região Norte: Apresenta os maiores desafios, com taxas de evasão até 40% superiores à média
                      nacional.
                    </li>
                    <li>
                      Região Nordeste: Mostra tendência de melhoria, mas ainda mantém taxas elevadas, especialmente em
                      áreas rurais.
                    </li>
                    <li>
                      Região Sul: Apresenta os melhores indicadores, com taxas de evasão consistentemente abaixo da
                      média nacional.
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">Diferenças entre Redes de Ensino</h3>
                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    <span className="font-medium">Rede Federal:</span> Apresenta os melhores indicadores, com taxas de
                    evasão significativamente menores e taxas de promoção mais altas.
                  </li>
                  <li>
                    <span className="font-medium">Rede Estadual:</span> Concentra a maior parte dos alunos do ensino
                    médio e enfrenta os maiores desafios, com taxas de evasão acima da média nacional.
                  </li>
                  <li>
                    <span className="font-medium">Rede Privada:</span> Mantém taxas de evasão baixas, mas com
                    disparidades significativas entre diferentes regiões.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">Tendências Temporais</h3>
                <p>
                  A análise dos dados ao longo do tempo revela uma tendência geral de melhoria gradual nos indicadores
                  educacionais, com redução nas taxas de evasão e aumento nas taxas de promoção. No entanto, essa
                  melhoria não é uniforme entre regiões e redes de ensino, com algumas áreas mostrando estagnação ou até
                  mesmo piora nos indicadores.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
