import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Caminho para o arquivo CSV na pasta public
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "br_inep_indicadores_educacionais_regiao_taxa_transicao.csv",
    )

    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.error(`Arquivo não encontrado: ${filePath}`)
      return NextResponse.json({ error: "Arquivo CSV não encontrado" }, { status: 404 })
    }

    // Ler o conteúdo do arquivo
    const fileContent = fs.readFileSync(filePath, "utf8")

    // Retornar o conteúdo como resposta
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "text/csv",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Erro ao ler arquivo CSV:", error)
    return NextResponse.json({ error: "Erro ao ler arquivo CSV" }, { status: 500 })
  }
}
