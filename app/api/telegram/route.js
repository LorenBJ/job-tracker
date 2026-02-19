// Reemplazá esto:
await fetch(`${process.env.NEXT_PUBLIC_URL}/api/telegram`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mensaje: `🎯 <b>Ofertas del día - Computrabajo</b>\n\n${analisis}`,
  }),
})

// Por esto:
await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: `🎯 <b>Ofertas del día - Computrabajo</b>\n\n${analisis}`,
    parse_mode: "HTML",
  }),
})