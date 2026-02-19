export async function GET(request) {
  // Verificar que la llamada viene de Vercel y no de alguien externo
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

    const res = await fetch(`${baseUrl}/api/buscar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cv: process.env.CV_TEXTO }),
    })

    const data = await res.json()
    return Response.json({ ok: true, data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
