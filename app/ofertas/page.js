"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [pendientesDeEliminar, setPendientesDeEliminar] = useState({})

  useEffect(() => {
    cargarOfertas()
  }, [])

  async function cargarOfertas() {
    setCargando(true)
    const { data, error } = await supabase
      .from("ofertas")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setOfertas(data)
    setCargando(false)
  }

  async function marcarPostulado(id) {
    const timer = setTimeout(async () => {
      await supabase.from("ofertas").delete().eq("id", id)
      setPendientesDeEliminar(prev => {
        const nuevo = { ...prev }
        delete nuevo[id]
        return nuevo
      })
      setOfertas(prev => prev.filter(o => o.id !== id))
    }, 5000)

    setPendientesDeEliminar(prev => ({ ...prev, [id]: timer }))
  }

  function revertir(id) {
    clearTimeout(pendientesDeEliminar[id])
    setPendientesDeEliminar(prev => {
      const nuevo = { ...prev }
      delete nuevo[id]
      return nuevo
    })
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Ofertas pendientes</h1>

      {cargando && <p className="text-gray-500">Cargando ofertas...</p>}

      {!cargando && ofertas.length === 0 && (
        <p className="text-gray-500">No hay ofertas pendientes. Hacé una búsqueda para cargar nuevas.</p>
      )}

      <div className="flex flex-col gap-4">
        {ofertas.map(oferta => (
          <div key={oferta.id} className={`border rounded-xl p-4 shadow-sm flex gap-4 items-start bg-white transition-opacity ${pendientesDeEliminar[oferta.id] ? "opacity-50" : "opacity-100"}`}>
            <div className="mt-1">
              {pendientesDeEliminar[oferta.id] ? (
                <input type="checkbox" className="w-5 h-5 accent-green-500" checked readOnly />
              ) : (
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer accent-green-500"
                  onChange={() => marcarPostulado(oferta.id)}
                />
              )}
            </div>
            <div className="flex-1">
              <a href={oferta.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline text-lg">{oferta.titulo}</a>
              <p className="text-gray-700 mt-1">{oferta.empresa}</p>
              <div className="flex gap-4 mt-1 text-sm text-gray-500">
                <span>📍 {oferta.ubicacion}</span>
                <span>🗓 {oferta.fecha}</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">{oferta.fuente}</span>
              </div>
              {pendientesDeEliminar[oferta.id] && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-600 text-sm">⏳ Marcada como postulada...</span>
                  <button
                    onClick={() => revertir(oferta.id)}
                    className="text-xs text-blue-500 hover:underline font-medium"
                  >
                    Revertir
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}