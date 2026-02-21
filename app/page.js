"use client"
import { useState, useEffect } from "react"
import { Search, Loader, CheckCircle, Zap } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [cv, setCv] = useState("")
  const [rol, setRol] = useState("")
  const [ubicacion, setUbicacion] = useState("capital-federal")
  const [categoria, setCategoria] = useState("tecnologia")
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { cargarPerfilGuardado() }, [])

  async function cargarPerfilGuardado() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from("perfiles").select("*").eq("user_id", user.id).single()
    if (data) {
      if (data.cv_texto) setCv(data.cv_texto)
      if (data.rol) setRol(data.rol)
      if (data.categoria) setCategoria(data.categoria)
      if (data.ubicacion) setUbicacion(data.ubicacion)
    }
  }

  async function buscar() {
    if (!cv) { setError("Pegá tu CV antes de buscar"); return }
    if (!rol) { setError("Escribí el rol que estás buscando"); return }
    setCargando(true); setError(null); setResultado(null)
    try {
      const res = await fetch("/api/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, rol, ubicacion, categoria }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResultado(data)
    } catch { setError("Error al conectar con el servidor") }
    finally { setCargando(false) }
  }

  const card = { background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", marginBottom: "16px" }
  const inputStyle = { background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#e2e8f0", fontSize: "13px", width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif" }
  const labelStyle = { fontSize: "11px", fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "10px" }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={13} className="text-blue-400" />
          <span style={{ fontSize: "11px", color: "#60A5FA", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>IA · Computrabajo</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", color: "white", marginBottom: "6px", lineHeight: 1.2 }}>Buscar ofertas</h1>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>Claude analiza y filtra las ofertas más compatibles con tu perfil.</p>
      </div>

      {/* CV */}
      <div style={card}>
        <label style={labelStyle}>Tu CV</label>
        <textarea
          style={{ ...inputStyle, height: "160px", resize: "none" }}
          placeholder="Pegá el texto de tu CV acá..."
          value={cv}
          onChange={(e) => setCv(e.target.value)}
        />
      </div>

      {/* Rol */}
      <div style={card}>
        <label style={labelStyle}>Rol buscado</label>
        <input
          style={inputStyle}
          placeholder="Ej: soporte técnico, diseñador UX, contador..."
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        />
      </div>

      {/* Categoría y Ubicación */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={card}>
          <label style={labelStyle}>Categoría</label>
          <select style={inputStyle} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="tecnologia">Tecnología</option>
            <option value="administracion-finanzas">Administración y Finanzas</option>
            <option value="ventas-marketing">Ventas y Marketing</option>
            <option value="atencion-cliente">Atención al Cliente</option>
            <option value="recursos-humanos">Recursos Humanos</option>
            <option value="ingenieria-tecnico">Ingeniería y Técnico</option>
            <option value="salud">Salud</option>
            <option value="educacion">Educación</option>
            <option value="arte-diseno">Arte y Diseño</option>
            <option value="logistica-produccion">Logística y Producción</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div style={{ ...card, marginBottom: 0 }}>
          <label style={labelStyle}>Ubicación</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[["capital-federal", "Capital Federal"], ["buenos-aires-gba", "Buenos Aires / GBA"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setUbicacion(val)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  border: ubicacion === val ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  background: ubicacion === val ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
                  color: ubicacion === val ? "#60A5FA" : "#9CA3AF",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", color: "#F87171", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <button
        onClick={buscar}
        disabled={cargando}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: cargando ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #3B82F6, #6366F1)",
          color: cargando ? "#6B7280" : "white",
          border: "none", borderRadius: "12px", padding: "12px 24px",
          fontSize: "14px", fontWeight: 500, cursor: cargando ? "not-allowed" : "pointer",
          transition: "all 0.2s", marginBottom: "24px",
          boxShadow: cargando ? "none" : "0 4px 20px rgba(59,130,246,0.3)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {cargando ? <Loader size={15} className="animate-spin" /> : <Search size={15} />}
        {cargando ? "Analizando con IA..." : "Buscar ofertas compatibles"}
      </button>

      {resultado && (
        <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CheckCircle size={16} className="text-emerald-400" />
          </div>
          <div>
            <p style={{ color: "#34D399", fontWeight: 500, marginBottom: "4px", fontSize: "14px" }}>{resultado.mensaje}</p>
            <p style={{ color: "#6B7280", fontSize: "13px" }}>
              Resumen enviado por Telegram · <a href="/ofertas" style={{ color: "#60A5FA" }}>Ver en Ofertas →</a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}