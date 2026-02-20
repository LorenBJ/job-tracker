import Anthropic from "@anthropic-ai/sdk"
import * as cheerio from "cheerio"
import { createClient } from "@supabase/supabase-js"

export const maxDuration = 30

const anthropic = new Anthropic()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const CATEGORIAS = {
  "tecnologia": [
    "https://ar.computrabajo.com/empleos-de-informatica-y-telecom-en-capital-federal"
  ],
  "administracion-finanzas": [
    "https://ar.computrabajo.com/empleos-de-administracion-y-oficina-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-economia-y-contabilidad-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-compras-comercio-exterior-en-capital-federal"
  ],
  "ventas-marketing": [
    "https://ar.computrabajo.com/empleos-de-marketing-y-ventas-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-mercadeo-publicidad-comunicacion-en-capital-federal"
  ],
  "atencion-cliente": [
    "https://ar.computrabajo.com/empleos-de-atencion-a-clientes-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-callcenter-telemercadeo-en-capital-federal"
  ],
  "recursos-humanos": [
    "https://ar.computrabajo.com/empleos-de-recursos-humanos-en-capital-federal"
  ],
  "ingenieria-tecnico": [
    "https://ar.computrabajo.com/empleos-de-ingenieria-y-tecnico-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-mantenimiento-y-reparaciones-tecnicas-en-capital-federal"
  ],
  "salud": [
    "https://ar.computrabajo.com/empleos-de-medicina-y-salud-en-capital-federal"
  ],
  "educacion": [
    "https://ar.computrabajo.com/empleos-de-educacion-y-universidad-en-capital-federal"
  ],
  "arte-diseno": [
    "https://ar.computrabajo.com/empleos-de-arte-y-diseno-y-medios-en-capital-federal"
  ],
  "logistica-produccion": [
    "https://ar.computrabajo.com/empleos-de-almacen-logistica-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-produccion-operaciones-en-capital-federal"
  ],
  "otros": [
    "https://ar.computrabajo.com/empleos-de-legal-y-asesoria-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-construccion-y-obra-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-otros-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-servicios-generales-aseo-y-seguridad-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-hosteleria-y-turismo-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-cientifico-y-investigacion-en-capital-federal",
    "https://ar.computrabajo.com/empleos-de-direccion-y-gerencia-en-capital-federal"
  ],
}

function obtenerUrls(categoria, ubicacion) {
  const urls = CATEGORIAS[categoria] || CATEGORIAS["otros"]
  return urls.map(url => url.replace("en-capital-federal", `en-${ubicacion}`))
}

async function buscarOfertasComputrabajo(urls) {
  const resultados = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url + "?by=publicationtime", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Cache-Control": "max-age=0",
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
        if (titulo) ofertas.push({ titulo, empresa, ubicacion, fecha, link, descripcion, fuente: "Computrabajo" })
      })

      return ofertas
    })
  )

  const todas = resultados.flat()
  console.log("OFERTAS COMPUTRABAJO:", todas.length)
  return todas
}

async function analizarCompatibilidad(ofertas, cvTexto, rol) {
  const mensaje = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Sos un experto en recursos humanos.

Tenés este CV:
${cvTexto}

El candidato busca posiciones de: ${rol}

Tu tarea es analizar las siguientes ofertas y determinar cuáles son genuinamente compatibles con el perfil, considerando:
- El título puede variar pero debe ser equivalente al rol buscado o muy cercano
- Evaluá la descripción completa, no solo el título
- Descartá ofertas que no tengan relación real con el rol buscado
- Considerá la experiencia, habilidades y tecnologías del CV

Ofertas disponibles:
${ofertas.map((o, i) => `${i + 1}. ${o.titulo} - ${o.empresa} (${o.ubicacion})
Publicado: ${o.fecha}
Descripción: ${o.descripcion}
Link: ${o.link}`).join("\n\n")}

Respondé ÚNICAMENTE con un JSON válido, sin markdown, sin bloques de código, sin texto adicional. El formato exacto es:
{
  "html": "el análisis en HTML usando <b> para resaltar, con título, empresa, por qué encaja y link para cada oferta compatible",
  "ofertas": [
    {
      "titulo": "título de la oferta",
      "empresa": "nombre de la empresa",
      "ubicacion": "ubicación",
      "link": "link completo",
      "fuente": "Computrabajo",
      "fecha": "fecha de publicación"
    }
  ]
}

Máximo 5 ofertas compatibles ordenadas de mayor a menor compatibilidad.`,
      },
    ],
  })

  const texto = mensaje.content[0].text
  console.log("RESPUESTA CLAUDE RAW:", texto)
  try {
    return JSON.parse(texto)
  } catch {
    return { html: texto, ofertas: [] }
  }
}

async function guardarOfertasEnSupabase(ofertas) {
  if (!ofertas || ofertas.length === 0) return

  const { error } = await supabase
    .from("ofertas")
    .insert(
      ofertas.map(o => ({
        titulo: o.titulo,
        empresa: o.empresa,
        ubicacion: o.ubicacion,
        link: o.link,
        fuente: o.fuente,
        fecha: o.fecha,
        postulado: false,
      }))
    )

  if (error) console.log("ERROR guardando en Supabase:", error.message)
  else console.log("Ofertas guardadas en Supabase:", ofertas.length)
}

export async function POST(request) {
  const { cv, rol, ubicacion, categoria } = await request.json()

  try {
    const urls = obtenerUrls(categoria, ubicacion)
    const ofertas = await buscarOfertasComputrabajo(urls)

    console.log("TOTAL OFERTAS:", ofertas.length)

    if (ofertas.length === 0) {
      return Response.json({ error: "No se encontraron ofertas" }, { status: 404 })
    }

    const { html: analisis, ofertas: ofertasCompatibles } = await analizarCompatibilidad(ofertas, cv, rol)

    await guardarOfertasEnSupabase(ofertasCompatibles)

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `🎯 <b>Ofertas para: ${rol}</b>\n\n${analisis}`,
        parse_mode: "HTML",
      }),
    })

    return Response.json({
      mensaje: `✅ Búsqueda completada. Se encontraron ${ofertasCompatibles.length} ofertas compatibles. Revisá la pestaña Ofertas.`,
      cantidad: ofertasCompatibles.length
    })

  } catch (error) {
    console.log("ERROR DETALLADO:", error.message, error.cause)
    return Response.json({ error: error.message }, { status: 500 })
  }
}