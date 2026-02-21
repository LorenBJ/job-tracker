import { extractText } from "unpdf"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf")

    if (!file) {
      return Response.json({ error: "No se recibió ningún archivo" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true })

    return Response.json({ texto: text })
  } catch (error) {
    console.log("ERROR PDF:", error.message)
    return Response.json({ error: "No se pudo extraer el texto del PDF" }, { status: 500 })
  }
}