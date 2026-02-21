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
      .from("ofertas")
      .select("*")
      .eq("postulado", false)
      .order("created_at", { ascending: false })
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
    <div className="flex items-center justify-center h-64">
      <Loader size={20} className="animate-spin text-blue-400" />
    </div>
  )

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase size={14} className="text-blue-400" />
          <span className="text-xs text-blue-400 font-medium tracking-widest uppercase">Ofertas compatibles</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl font-800 text-white tracking-tight mb-2">
          {ofertas.length === 0 ? "Sin ofertas pendientes" : `${ofertas.length} oferta${ofertas.length !== 1 ? "s" : ""}`}
        </h1>
        <p className="text-gray-500 text-sm">Marcá las que ya enviaste para mantener tu lista limpia.</p>
      </div>

      {ofertas.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/6 rounded-2xl p-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Briefcase size={20} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-sm">Las ofertas compatibles aparecerán acá después de cada búsqueda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ofertas.map((oferta) => {
            const esPendiente = !!pendientes[oferta.id]
            return (
              <div key={oferta.id} className={`bg-white/[0.02] border rounded-2xl p-5 transition-all duration-300 ${esPendiente ? "border-emerald-500/20 opacity-50" : "border-white/6 hover:border-white/10"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-medium text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/10">{oferta.fuente}</span>
                      {oferta.fecha && <span className="text-[11px] text-gray-600">{oferta.fecha}</span>}
                    </div>
                    <h3 className="text-white text-sm font-medium mb-1 leading-snug">{oferta.titulo}</h3>
                    {oferta.empresa && <p className="text-gray-500 text-xs mb-0.5">{oferta.empresa}</p>}
                    {oferta.ubicacion && <p className="text-gray-600 text-xs">📍 {oferta.ubicacion}</p>}
                    {oferta.motivo && (
                      <p className="text-gray-400 text-xs mt-3 leading-relaxed border-t border-white/5 pt-3">{oferta.motivo}</p>
                    )}
                    {esPendiente && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-emerald-400 text-xs">✓ Marcada como postulada</span>
                        <button onClick={() => revertir(oferta.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"><RotateCcw size={11} />Revertir</button>
                      </div>
                    )}
                  </div>
                  {!esPendiente && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <a href={oferta.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-white/5 hover:bg-white/8 text-gray-300 hover:text-white text-xs px-3 py-2 rounded-lg transition-all border border-white/8"><ExternalLink size={12} />Ver oferta</a>
                      <button onClick={() => marcarPostulado(oferta.id)} className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 text-xs px-3 py-2 rounded-lg transition-all border border-emerald-500/20"><CheckCircle size={12} />Me postulé</button>
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