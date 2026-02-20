export async function GET(request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

    const res = await fetch(`${baseUrl}/api/buscar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cv: process.env.CV_TEXTO,
        rol: process.env.CV_ROL || "soporte tecnico",
        categoria: process.env.CV_CATEGORIA || "tecnologia",
        ubicacion: process.env.CV_UBICACION || "capital-federal",
      }),
    })

    const data = await res.json()
    return Response.json({ ok: true, data })
  } catch (error) {
    console.log("CRON ERROR:", error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}