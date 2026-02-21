// app/ofertas/page.js
"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ExternalLink, CheckCircle, Loader, Briefcase, RotateCcw } from "lucide-react"

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [pendientes, setPendientes] = useState({})

  useEffect(() => { cargarOfertas() }, [])

  async function cargarOfertas() {
    setCargando(true)
    const { data, error } = await supabase
      .from("ofertas").select("*").eq("postulado", false).order("created_at", { ascending: false })
    if (!error) setOfertas(data || [])
    setCargando(false)
  }

  async function marcarPostulado(id) {
    const timer = setTimeout(async () => {
      await supabase.from("ofertas").delete().eq("id", id)
      setPendientes(prev => { const n = { ...prev }; delete n[id]; return n })
      setOfertas(prev => prev.filter(o => o.id !== id))
    }, 5000)
    setPendientes(prev => ({ ...prev, [id]: timer }))
  }

  function revertir(id) {
    clearTimeout(pendientes[id])
    setPendientes(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  if (cargando) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
      <Loader size={20} className="animate-spin text-blue-400" />
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <Briefcase size={13} style={{ color: "#60A5FA" }} />
          <span style={{ fontSize: "11px", color: "#60A5FA", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>Ofertas compatibles</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "28px", color: "white", marginBottom: "6px" }}>
          {ofertas.length === 0 ? "Sin ofertas pendientes" : `${ofertas.length} oferta${ofertas.length !== 1 ? "s" : ""}`}
        </h1>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>Marcá las que ya enviaste para mantener tu lista limpia.</p>
      </div>

      {ofertas.length === 0 ? (
        <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Briefcase size={20} style={{ color: "#374151" }} />
          </div>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Las ofertas compatibles aparecerán acá después de cada búsqueda.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {ofertas.map((oferta) => {
            const esPendiente = !!pendientes[oferta.id]
            return (
              <div key={oferta.id} style={{
                background: esPendiente ? "rgba(16,185,129,0.04)" : "#111827",
                border: esPendiente ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px", padding: "20px",
                opacity: esPendiente ? 0.6 : 1,
                transition: "all 0.3s",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "#60A5FA", background: "rgba(59,130,246,0.1)", padding: "2px 8px", borderRadius: "20px", border: "1px solid rgba(59,130,246,0.15)" }}>{oferta.fuente}</span>
                      {oferta.fecha && <span style={{ fontSize: "11px", color: "#4B5563" }}>{oferta.fecha}</span>}
                    </div>
                    <h3 style={{ color: "white", fontSize: "14px", fontWeight: 500, marginBottom: "4px", lineHeight: 1.4 }}>{oferta.titulo}</h3>
                    {oferta.empresa && <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "2px" }}>{oferta.empresa}</p>}
                    {oferta.ubicacion && <p style={{ color: "#6B7280", fontSize: "12px" }}>📍 {oferta.ubicacion}</p>}
                    {oferta.motivo && (
                      <p style={{ color: "#9CA3AF", fontSize: "12px", marginTop: "12px", lineHeight: 1.6, paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>{oferta.motivo}</p>
                    )}
                    {esPendiente && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
                        <span style={{ color: "#34D399", fontSize: "12px" }}>✓ Marcada como postulada</span>
                        <button onClick={() => revertir(oferta.id)} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6B7280", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          <RotateCcw size={11} />Revertir
                        </button>
                      </div>
                    )}
                  </div>

                  {!esPendiente && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                      <a href={oferta.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#D1D5DB", fontSize: "12px", padding: "7px 12px", borderRadius: "8px", textDecoration: "none", transition: "all 0.15s" }}><ExternalLink size={12} />Ver oferta</a>
                      <button onClick={() => marcarPostulado(oferta.id)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#34D399", fontSize: "12px", padding: "7px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}><CheckCircle size={12} />Me postulé</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}