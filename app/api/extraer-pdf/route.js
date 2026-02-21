import pdfParse from "pdf-parse"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf")

    if (!file) {
      return Response.json({ error: "No se recibió ningún archivo" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const data = await pdfParse(buffer)

    return Response.json({ texto: data.text })
  } catch (error) {
    console.log("ERROR PDF:", error.message)
    return Response.json({ error: "No se pudo extraer el texto del PDF" }, { status: 500 })
  }
}