import Anthropic from "@anthropic-ai/sdk"
import * as cheerio from "cheerio"
export const maxDuration = 30


const anthropic = new Anthropic()

async function buscarOfertasComputrabajo() {
  const url = "https://ar.computrabajo.com/empleos-de-informatica-y-telecom-en-capital-federal?by=publicationtime"

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "es-AR,es;q=0.9",
    },
  })

  const html = await res.text()
  const $ = cheerio.load(html)
  const ofertas = []

  $("article.box_offer").each((i, el) => {
    const titulo = $(el).find("h2 a").text().trim()
    const empresa = $(el).find("a.nameEmp").text().trim()
    const ubicacion = $(el).find("span.city").text().trim()
    const fecha = $(el).find("p.date").text().trim()
    const link = "https://ar.computrabajo.com" + $(el).find("h2 a").attr("href")
    const descripcion = $(el).find("p.description").text().trim()

    if (titulo) {
      ofertas.push({ titulo, empresa, ubicacion, fecha, link, descripcion })
    }
  })

  console.log("OFERTAS COMPUTRABAJO:", ofertas.length)
  return ofertas
}

async function analizarCompatibilidad(ofertas, cvTexto) {
  const mensaje = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Sos un experto en recursos humanos especializado en tecnología.

Tenés este CV:
${cvTexto}

El candidato busca posiciones de soporte técnico IT en Buenos Aires.

Tu tarea es analizar las siguientes ofertas de Computrabajo y determinar cuáles son genuinamente compatibles con el perfil, considerando:
- Títulos equivalentes: "soporte técnico", "helpdesk", "mesa de ayuda", "técnico IT", "soporte IT", "analista de soporte", "soporte N1/N2" y similares
- Evaluá la descripción completa, no solo el título
- Descartá ofertas que no tengan componente técnico real
- Considerá las tecnologías y experiencia del CV

Ofertas disponibles:
${ofertas.map((o, i) => `${i + 1}. ${o.titulo} - ${o.empresa} (${o.ubicacion})
Publicado: ${o.fecha}
Descripción: ${o.descripcion}
Link: ${o.link}`).join("\n\n")}

Respondé en español con formato HTML usando <b> para resaltar.
Para cada oferta compatible incluí:
- <b>Título y empresa</b>
- Por qué encaja con el perfil
- Link para postularse

Descartá las que no son técnicas. Listá máximo 5 ordenadas de mayor a menor compatibilidad.`,
      },
    ],
  })

  return mensaje.content[0].text
}

export async function POST(request) {
  const { cv } = await request.json()

  try {
    const ofertas = await buscarOfertasComputrabajo()
    console.log("OFERTAS OK:", ofertas.length)

    if (ofertas.length === 0) {
      return Response.json({ error: "No se encontraron ofertas" }, { status: 404 })
    }

    console.log("LLAMANDO A ANTHROPIC...")
    const analisis = await analizarCompatibilidad(ofertas, cv)
    console.log("ANTHROPIC OK")

    console.log("LLAMANDO A TELEGRAM...")
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/telegram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensaje: `🎯 <b>Ofertas del día - Computrabajo</b>\n\n${analisis}`,
      }),
    })
    console.log("TELEGRAM OK")

    return Response.json({ ofertas, analisis })
  } catch (error) {
    console.log("ERROR DETALLADO:", error.message, error.cause)
    return Response.json({ error: error.message }, { status: 500 })
  }
}