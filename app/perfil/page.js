"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Upload, Save, Loader, CheckCircle, User } from "lucide-react"

export default function Perfil() {
  const [cvTexto, setCvTexto] = useState("")
  const [rol, setRol] = useState("")
  const [categoria, setCategoria] = useState("tecnologia")
  const [ubicacion, setUbicacion] = useState("capital-federal")
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [extrayendo, setExtrayendo] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => { cargarPerfil() }, [])

  async function cargarPerfil() {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from("perfiles").select("*").eq("user_id", user.id).single()
    if (data) {
      setCvTexto(data.cv_texto || "")
      setRol(data.rol || "")
      setCategoria(data.categoria || "tecnologia")
      setUbicacion(data.ubicacion || "capital-federal")
    }
    setCargando(false)
  }

  async function guardarPerfil() {
    setGuardando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from("perfiles").upsert({
      user_id: user.id, cv_texto: cvTexto, rol, categoria, ubicacion,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })
    setGuardando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  async function extraerPDF(e) {
    const file = e.target.files[0]
    if (!file) return
    setExtrayendo(true)
    const formData = new FormData()
    formData.append("pdf", file)
    const res = await fetch("/api/extraer-pdf", { method: "POST", body: formData })
    const data = await res.json()
    if (data.texto) setCvTexto(data.texto)
    setExtrayendo(false)
  }

  const card = { background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", marginBottom: "16px" }
  const inputStyle = { background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#e2e8f0", fontSize: "13px", width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif" }
  const labelStyle = { fontSize: "11px", fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "10px" }

  if (cargando) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
      <Loader size={20} className="animate-spin text-blue-400" />
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <User size={13} style={{ color: "#60A5FA" }} />
          <span style={{ fontSize: "11px", color: "#60A5FA", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>Configuración</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", color: "white", marginBottom: "6px" }}>Mi Perfil</h1>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>Configurá tu CV y preferencias para búsquedas automáticas.</p>
      </div>

      {/* CV */}
      <div style={card}>
        <label style={labelStyle}>Tu CV</label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontSize: "13px", color: "#D1D5DB", marginBottom: "12px", transition: "all 0.15s" }}>
          {extrayendo ? <><Loader size={13} className="animate-spin" />Extrayendo...</> : <><Upload size={13} />Subir PDF</>}
          <input type="file" accept=".pdf" style={{ display: "none" }} onChange={extraerPDF} disabled={extrayendo} />
        </label>
        <p style={{ fontSize: "11px", color: "#4B5563", marginBottom: "12px" }}>El texto del PDF se cargará automáticamente abajo</p>
        <textarea
          style={{ ...inputStyle, height: "200px", resize: "none" }}
          placeholder="Pegá el texto de tu CV acá o subí un PDF..."
          value={cvTexto}
          onChange={(e) => setCvTexto(e.target.value)}
        />
      </div>

      {/* Preferencias */}
      <div style={card}>
        <label style={labelStyle}>Preferencias de búsqueda</label>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ ...labelStyle, marginBottom: "8px" }}>Rol buscado</label>
          <input style={inputStyle} placeholder="Ej: soporte técnico, contador, diseñador..." value={rol} onChange={(e) => setRol(e.target.value)} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ ...labelStyle, marginBottom: "8px" }}>Categoría</label>
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
          <div>
            <label style={{ ...labelStyle, marginBottom: "8px" }}>Ubicación</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[["capital-federal", "Capital Federal"], ["buenos-aires-gba", "Buenos Aires / GBA"]].map(([val, label]) => (
                <button key={val} onClick={() => setUbicacion(val)} style={{
                  padding: "8px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                  border: ubicacion === val ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  background: ubicacion === val ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
                  color: ubicacion === val ? "#60A5FA" : "#9CA3AF", fontFamily: "'DM Sans', sans-serif",
                }}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={guardarPerfil}
        disabled={guardando}
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: guardado ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg, #3B82F6, #6366F1)",
          border: guardado ? "1px solid rgba(16,185,129,0.3)" : "none",
          color: guardado ? "#34D399" : "white",
          borderRadius: "12px", padding: "11px 24px", fontSize: "14px", fontWeight: 500,
          cursor: guardando ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: guardado ? "none" : "0 4px 20px rgba(59,130,246,0.25)", transition: "all 0.2s",
        }}
      >
        {guardado ? <><CheckCircle size={15} />Guardado</> : guardando ? <><Loader size={15} className="animate-spin" />Guardando...</> : <><Save size={15} />Guardar perfil</>}
      </button>
    </div>
  )
}