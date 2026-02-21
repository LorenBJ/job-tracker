"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Loader, Kanban, ExternalLink, Plus, X } from "lucide-react"

const COLUMNAS = [
  { id: "postulado", label: "Postulado", color: "#3B82F6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
  { id: "en_revision", label: "En revisión", color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  { id: "entrevista", label: "Entrevista", color: "#8B5CF6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
  { id: "oferta", label: "Oferta 🎉", color: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
  { id: "rechazado", label: "Rechazado", color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
]

export default function Seguimiento() {
  const [postulaciones, setPostulaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [dragging, setDragging] = useState(null)
  const [modal, setModal] = useState(null) // oferta seleccionada para ver detalle

  useEffect(() => { cargarPostulaciones() }, [])

  async function cargarPostulaciones() {
    setCargando(true)
    const { data, error } = await supabase
      .from("ofertas")
      .select("*")
      .eq("postulado", true)
      .order("created_at", { ascending: false })
    if (!error) setPostulaciones(data || [])
    setCargando(false)
  }

  async function cambiarEstado(id, nuevoEstado) {
    await supabase.from("ofertas").update({ estado: nuevoEstado }).eq("id", id)
    setPostulaciones(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
  }

  async function eliminar(id) {
    await supabase.from("ofertas").delete().eq("id", id)
    setPostulaciones(prev => prev.filter(p => p.id !== id))
    setModal(null)
  }

  function onDragStart(e, id) {
    setDragging(id)
    e.dataTransfer.effectAllowed = "move"
  }

  function onDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "move" }

  function onDrop(e, columnaId) {
    e.preventDefault()
    if (dragging) { cambiarEstado(dragging, columnaId); setDragging(null) }
  }

  if (cargando) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
      <Loader size={20} className="animate-spin text-blue-400" />
    </div>
  )

  const porColumna = (colId) => postulaciones.filter(p => (p.estado || "postulado") === colId)

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <Kanban size={13} style={{ color: "#60A5FA" }} />
          <span style={{ fontSize: "11px", color: "#60A5FA", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>Kanban</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "28px", color: "white", marginBottom: "6px" }}>Seguimiento</h1>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>Arrastrá las tarjetas para actualizar el estado de cada postulación.</p>
      </div>

      {postulaciones.length === 0 ? (
        <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Kanban size={20} style={{ color: "#374151" }} />
          </div>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Las ofertas que marques como postuladas aparecerán acá.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", overflowX: "auto" }}>
          {COLUMNAS.map(col => (
            <div
              key={col.id}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, col.id)}
              style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: "14px", padding: "14px", minHeight: "300px" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: col.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{col.label}</span>
                <span style={{ fontSize: "11px", color: col.color, background: `${col.border}`, padding: "1px 7px", borderRadius: "20px" }}>{porColumna(col.id).length}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {porColumna(col.id).map(p => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, p.id)}
                    onClick={() => setModal(p)}
                    style={{
                      background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                      padding: "12px", cursor: "grab", transition: "all 0.15s",
                      opacity: dragging === p.id ? 0.4 : 1,
                    }}
                  >
                    <p style={{ color: "white", fontSize: "12px", fontWeight: 500, marginBottom: "4px", lineHeight: 1.4 }}>{p.titulo}</p>
                    {p.empresa && <p style={{ color: "#6B7280", fontSize: "11px" }}>{p.empresa}</p>}
                    {p.ubicacion && <p style={{ color: "#4B5563", fontSize: "11px" }}>📍 {p.ubicacion}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal detalle */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "24px" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "28px", maxWidth: "480px", width: "100%" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "#60A5FA", background: "rgba(59,130,246,0.1)", padding: "2px 8px", borderRadius: "20px", marginBottom: "8px", display: "inline-block" }}>{modal.fuente}</span>
                <h3 style={{ color: "white", fontSize: "16px", fontWeight: 600, marginTop: "6px" }}>{modal.titulo}</h3>
                {modal.empresa && <p style={{ color: "#9CA3AF", fontSize: "13px", marginTop: "2px" }}>{modal.empresa}</p>}
                {modal.ubicacion && <p style={{ color: "#6B7280", fontSize: "13px" }}>📍 {modal.ubicacion}</p>}
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer" }}><X size={18} /></button>
            </div>

            {modal.motivo && (
              <p style={{ color: "#9CA3AF", fontSize: "13px", lineHeight: 1.6, paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }}>{modal.motivo}</p>
            )}

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {COLUMNAS.map(col => (
                <button
                  key={col.id}
                  onClick={() => { cambiarEstado(modal.id, col.id); setModal({ ...modal, estado: col.id }) }}
                  style={{
                    padding: "5px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    border: `1px solid ${col.border}`,
                    background: (modal.estado || "postulado") === col.id ? col.bg : "transparent",
                    color: col.color, transition: "all 0.15s",
                  }}
                >{col.label}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <a href={modal.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#D1D5DB", fontSize: "13px", padding: "8px 14px", borderRadius: "8px", textDecoration: "none" }}><ExternalLink size={13} />Ver oferta</a>
              <button onClick={() => eliminar(modal.id)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171", fontSize: "13px", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}><X size={13} />Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}