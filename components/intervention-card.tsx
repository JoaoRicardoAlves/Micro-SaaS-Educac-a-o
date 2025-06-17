"use client"

import { useState } from "react"
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface InterventionCardProps {
  intervention: {
    id: number
    name: string
    description: string
    estimatedReduction: number
    implementationCost: string
    timeToImpact: string
    currentEvasao: number
    projectedEvasao: number
    targetGroups: string[]
  }
}

export function InterventionCard({ intervention }: InterventionCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Determinar a cor do badge de custo
  const getCostColor = (cost: string) => {
    switch (cost) {
      case "Baixo":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Médio":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "Alto":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{intervention.name}</CardTitle>
        <CardDescription>{intervention.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getCostColor(intervention.implementationCost)}>
            Custo: {intervention.implementationCost}
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Impacto: {intervention.timeToImpact}
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Redução estimada:</span>
            <span className="font-medium">{intervention.estimatedReduction}%</span>
          </div>
          <Progress value={intervention.estimatedReduction} max={25} className="h-2" />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted p-3">
          <div className="text-center">
            <div className="text-sm font-medium">Taxa Atual</div>
            <div className="text-2xl font-bold">{intervention.currentEvasao}%</div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div className="text-center">
            <div className="text-sm font-medium">Taxa Projetada</div>
            <div className="text-2xl font-bold text-green-600">{intervention.projectedEvasao}%</div>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">Grupos-alvo:</div>
            <ul className="ml-5 list-disc text-sm text-muted-foreground">
              {intervention.targetGroups.map((group, index) => (
                <li key={index}>{group}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <>
              <span>Mostrar menos</span>
              <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Mostrar mais</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
