"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { CheckCircle, ExternalLink, Loader } from "lucide-react"

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarOfertas()
  }, [])

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
    await supabase.from("ofertas").update({ postulado: true }).eq("id", id)
    setOfertas(prev => prev.filter(o => o.id !== id))
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size={24} className="animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Ofertas</h2>
      <p className="text-gray-400 mb-8">
        {ofertas.length === 0
          ? "No tenés ofertas pendientes"
          : `${ofertas.length} oferta${ofertas.length !== 1 ? "s" : ""} pendiente${ofertas.length !== 1 ? "s" : ""}`}
      </p>

      {ofertas.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-sm">Las ofertas compatibles aparecerán acá después de cada búsqueda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ofertas.map((oferta) => (
            <div key={oferta.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">{oferta.fuente}</span>
                  <span className="text-xs text-gray-500">{oferta.fecha}</span>
                </div>
                <h3 className="text-white font-medium mb-1 truncate">{oferta.titulo}</h3>
                <p className="text-gray-400 text-sm mb-1">{oferta.empresa}</p>
                <p className="text-gray-500 text-xs">{oferta.ubicacion}</p>
                {oferta.motivo && (
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">{oferta.motivo}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <a href={oferta.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg transition">
                  <ExternalLink size={13} />
                  Ver oferta
                </a>
                <button onClick={() => marcarPostulado(oferta.id)} className="flex items-center gap-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs px-3 py-2 rounded-lg transition">
                  <CheckCircle size={13} />
                  Me postulé
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}