"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InterventionCard } from "@/components/intervention-card"
import { SuccessCases } from "@/components/success-cases"
import { calculateInterventionImpact } from "@/lib/predictions"

export default function SolucoesPage() {
  const [interventions, setInterventions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const interventionData = await calculateInterventionImpact()
        setInterventions(interventionData)
      } catch (error) {
        console.error("Erro ao carregar intervenções:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Soluções para Evasão Escolar</h1>
          <p className="text-muted-foreground">
            Intervenções e políticas recomendadas para reduzir a evasão escolar no ensino médio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Exportar Relatório</span>
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Intervenções Recomendadas</CardTitle>
            <CardDescription>
              Políticas e programas com potencial para reduzir as taxas de evasão escolar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {interventions.map((intervention) => (
                  <InterventionCard key={intervention.id} intervention={intervention} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Casos de Sucesso</CardTitle>
            <CardDescription>
              Exemplos de regiões e redes de ensino que conseguiram reduzir significativamente a evasão escolar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SuccessCases />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estratégias por Contexto</CardTitle>
            <CardDescription>Recomendações específicas para diferentes contextos educacionais</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="urbano" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="urbano">Contexto Urbano</TabsTrigger>
                <TabsTrigger value="rural">Contexto Rural</TabsTrigger>
                <TabsTrigger value="vulneravel">Áreas Vulneráveis</TabsTrigger>
              </TabsList>
              <TabsContent value="urbano" className="mt-4 space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Estratégias para Escolas Urbanas</h3>
                  <p className="text-muted-foreground">
                    As escolas em contextos urbanos enfrentam desafios específicos relacionados à competição com o
                    mercado de trabalho, violência e desigualdades sociais.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Recomendações Principais</h4>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>
                      <span className="font-medium">Integração com o mercado de trabalho:</span> Programas de estágio e
                      aprendizagem profissional que permitam conciliar estudos e trabalho.
                    </li>
                    <li>
                      <span className="font-medium">Currículo flexível:</span> Adaptação do currículo para incluir
                      habilidades práticas e relevantes para o contexto urbano.
                    </li>
                    <li>
                      <span className="font-medium">Segurança escolar:</span> Programas de mediação de conflitos e
                      prevenção da violência no ambiente escolar.
                    </li>
                    <li>
                      <span className="font-medium">Suporte psicossocial:</span> Atendimento especializado para
                      estudantes em situação de vulnerabilidade social ou emocional.
                    </li>
                    <li>
                      <span className="font-medium">Tecnologia educacional:</span> Uso de recursos tecnológicos para
                      tornar o aprendizado mais atrativo e personalizado.
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="rural" className="mt-4 space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Estratégias para Escolas Rurais</h3>
                  <p className="text-muted-foreground">
                    As escolas em contextos rurais enfrentam desafios relacionados à distância, infraestrutura e
                    relevância do currículo para a realidade local.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Recomendações Principais</h4>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>
                      <span className="font-medium">Transporte escolar:</span> Melhoria e ampliação do transporte
                      escolar para garantir acesso às escolas.
                    </li>
                    <li>
                      <span className="font-medium">Pedagogia da alternância:</span> Implementação de modelos que
                      alternam períodos na escola e na comunidade/propriedade familiar.
                    </li>
                    <li>
                      <span className="font-medium">Currículo contextualizado:</span> Adaptação do currículo para
                      incluir conhecimentos relevantes para o contexto rural e agrícola.
                    </li>
                    <li>
                      <span className="font-medium">Tecnologias de educação a distância:</span> Uso de recursos de EAD
                      para complementar o ensino presencial e superar barreiras geográficas.
                    </li>
                    <li>
                      <span className="font-medium">Valorização da cultura local:</span> Integração de saberes e
                      práticas culturais locais no currículo escolar.
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="vulneravel" className="mt-4 space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Estratégias para Áreas Vulneráveis</h3>
                  <p className="text-muted-foreground">
                    Escolas em áreas de alta vulnerabilidade social enfrentam desafios relacionados à pobreza, violência
                    e falta de perspectivas.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Recomendações Principais</h4>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>
                      <span className="font-medium">Programas de transferência de renda:</span> Vinculados à frequência
                      e desempenho escolar para incentivar a permanência na escola.
                    </li>
                    <li>
                      <span className="font-medium">Alimentação escolar:</span> Fortalecimento dos programas de
                      alimentação escolar como fator de atração e permanência.
                    </li>
                    <li>
                      <span className="font-medium">Escolas em tempo integral:</span> Ampliação da jornada escolar com
                      atividades diversificadas e suporte pedagógico.
                    </li>
                    <li>
                      <span className="font-medium">Rede de proteção social:</span> Articulação entre escola, serviços
                      de assistência social, saúde e segurança pública.
                    </li>
                    <li>
                      <span className="font-medium">Mentoria e tutoria:</span> Programas de acompanhamento
                      individualizado para estudantes em maior risco de evasão.
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Implementação e Monitoramento</CardTitle>
            <CardDescription>
              Diretrizes para implementação eficaz das intervenções e monitoramento de resultados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-medium">Etapas para Implementação</h3>
                <ol className="ml-6 list-decimal space-y-2">
                  <li>
                    <span className="font-medium">Diagnóstico:</span> Análise detalhada dos dados de evasão e seus
                    fatores associados no contexto específico.
                  </li>
                  <li>
                    <span className="font-medium">Planejamento:</span> Definição de objetivos, metas, indicadores,
                    responsáveis e cronograma de implementação.
                  </li>
                  <li>
                    <span className="font-medium">Formação:</span> Capacitação dos profissionais envolvidos na
                    implementação das intervenções.
                  </li>
                  <li>
                    <span className="font-medium">Implementação piloto:</span> Teste das intervenções em escala reduzida
                    para ajustes antes da expansão.
                  </li>
                  <li>
                    <span className="font-medium">Expansão:</span> Ampliação gradual das intervenções bem-sucedidas para
                    mais escolas e regiões.
                  </li>
                  <li>
                    <span className="font-medium">Monitoramento contínuo:</span> Acompanhamento sistemático dos
                    indicadores de processo e resultado.
                  </li>
                  <li>
                    <span className="font-medium">Avaliação de impacto:</span> Análise rigorosa dos efeitos das
                    intervenções sobre as taxas de evasão.
                  </li>
                </ol>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 text-lg font-medium">Indicadores de Monitoramento</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium">Indicadores de Processo</h4>
                    <ul className="ml-5 mt-2 list-disc text-sm text-muted-foreground">
                      <li>Número de escolas/alunos atendidos</li>
                      <li>Frequência das atividades realizadas</li>
                      <li>Adesão dos profissionais e estudantes</li>
                      <li>Qualidade da implementação</li>
                      <li>Recursos investidos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Indicadores de Resultado</h4>
                    <ul className="ml-5 mt-2 list-disc text-sm text-muted-foreground">
                      <li>Taxa de frequência escolar</li>
                      <li>Taxa de evasão escolar</li>
                      <li>Taxa de conclusão do ensino médio</li>
                      <li>Desempenho acadêmico</li>
                      <li>Satisfação dos estudantes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
