import Anthropic from "@anthropic-ai/sdk"
import * as cheerio from "cheerio"
export const maxDuration = 30


const anthropic = new Anthropic()

const CATEGORIAS = {
  "marketing-ventas": "https://ar.computrabajo.com/empleos-de-marketing-y-ventas-en-capital-federal",
  "produccion-operaciones": "https://ar.computrabajo.com/empleos-de-produccion-operaciones-en-capital-federal",
  "almacen-logistica": "https://ar.computrabajo.com/empleos-de-almacen-logistica-en-capital-federal",
  "mantenimiento": "https://ar.computrabajo.com/empleos-de-mantenimiento-y-reparaciones-tecnicas-en-capital-federal",
  "otros": "https://ar.computrabajo.com/empleos-de-otros-en-capital-federal",
  "informatica-telecom": "https://ar.computrabajo.com/empleos-de-informatica-y-telecom-en-capital-federal",
  "administracion": "https://ar.computrabajo.com/empleos-de-administracion-y-oficina-en-capital-federal",
  "atencion-clientes": "https://ar.computrabajo.com/empleos-de-atencion-a-clientes-en-capital-federal",
  "hosteleria-turismo": "https://ar.computrabajo.com/empleos-de-hosteleria-y-turismo-en-capital-federal",
  "medicina-salud": "https://ar.computrabajo.com/empleos-de-medicina-y-salud-en-capital-federal",
  "contabilidad": "https://ar.computrabajo.com/empleos-de-economia-y-contabilidad-en-capital-federal",
  "servicios-generales": "https://ar.computrabajo.com/empleos-de-servicios-generales-aseo-y-seguridad-en-capital-federal",
  "callcenter": "https://ar.computrabajo.com/empleos-de-callcenter-telemercadeo-en-capital-federal",
  "construccion": "https://ar.computrabajo.com/empleos-de-construccion-y-obra-en-capital-federal",
  "ingenieria": "https://ar.computrabajo.com/empleos-de-ingenieria-y-tecnico-en-capital-federal",
  "recursos-humanos": "https://ar.computrabajo.com/empleos-de-recursos-humanos-en-capital-federal",
  "publicidad-comunicacion": "https://ar.computrabajo.com/empleos-de-mercadeo-publicidad-comunicacion-en-capital-federal",
  "compras": "https://ar.computrabajo.com/empleos-de-compras-comercio-exterior-en-capital-federal",
  "arte-diseno": "https://ar.computrabajo.com/empleos-de-arte-y-diseno-y-medios-en-capital-federal",
  "gerencia": "https://ar.computrabajo.com/empleos-de-direccion-y-gerencia-en-capital-federal",
  "ciencia": "https://ar.computrabajo.com/empleos-de-cientifico-y-investigacion-en-capital-federal",
  "educacion": "https://ar.computrabajo.com/empleos-de-educacion-y-universidad-en-capital-federal",
  "legal": "https://ar.computrabajo.com/empleos-de-legal-y-asesoria-en-capital-federal",
}

async function detectarCategoria(rol) {
  const mensaje = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: `Dado el rol "${rol}", elegí la categoría más adecuada de esta lista y respondé SOLO con la clave, sin explicación:

marketing-ventas, produccion-operaciones, almacen-logistica, mantenimiento, otros, informatica-telecom, administracion, atencion-clientes, hosteleria-turismo, medicina-salud, contabilidad, servicios-generales, callcenter, construccion, ingenieria, recursos-humanos, publicidad-comunicacion, compras, arte-diseno, gerencia, ciencia, educacion, legal`,
      },
    ],
  })

  const categoria = mensaje.content[0].text.trim()
  console.log("CATEGORIA DETECTADA:", categoria)
  return CATEGORIAS[categoria] || CATEGORIAS["otros"]
}

async function buscarOfertasComputrabajo(url) {
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

    if (titulo) {
      ofertas.push({ titulo, empresa, ubicacion, fecha, link, descripcion })
    }
  })

  console.log("OFERTAS COMPUTRABAJO:", ofertas.length)
  return ofertas
}

async function analizarCompatibilidad(ofertas, cvTexto, rol) {
  const mensaje = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Sos un experto en recursos humanos.

Tenés este CV:
${cvTexto}

El candidato busca posiciones de: ${rol}

Tu tarea es analizar las siguientes ofertas de Computrabajo y determinar cuáles son genuinamente compatibles con el perfil, considerando:
- El título puede variar pero debe ser equivalente al rol buscado o muy cercano
- Evaluá la descripción completa, no solo el título
- Descartá ofertas que no tengan relación real con el rol buscado
- Considerá la experiencia, habilidades y tecnologías del CV

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

Descartá las que no son compatibles. Listá máximo 5 ordenadas de mayor a menor compatibilidad.`,
      },
    ],
  })

  return mensaje.content[0].text
}

export async function POST(request) {
  const { cv, rol } = await request.json()

  try {
    console.log("DETECTANDO CATEGORIA...")
    const urlCategoria = await detectarCategoria(rol)
    console.log("URL:", urlCategoria)

    const ofertas = await buscarOfertasComputrabajo(urlCategoria)
    console.log("OFERTAS OK:", ofertas.length)

    if (ofertas.length === 0) {
      return Response.json({ error: "No se encontraron ofertas" }, { status: 404 })
    }

    console.log("LLAMANDO A ANTHROPIC...")
    const analisis = await analizarCompatibilidad(ofertas, cv, rol)
    console.log("ANTHROPIC OK")

    console.log("LLAMANDO A TELEGRAM...")
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `🎯 <b>Ofertas para: ${rol}</b>\n\n${analisis}`,
        parse_mode: "HTML",
      }),
    })
    console.log("TELEGRAM OK")

    return Response.json({ ofertas, analisis })
  } catch (error) {
    console.log("ERROR DETALLADO:", error.message, error.cause)
    return Response.json({ error: error.message }, { status: 500 })
  }
}