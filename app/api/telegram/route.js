export async function POST(request) {
  const { mensaje } = await request.json()

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: mensaje,
      parse_mode: "HTML",
    }),
  })

  const data = await res.json()
  return Response.json(data)
}