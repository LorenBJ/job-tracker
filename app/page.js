"use client"
import { useState } from "react"
import { Search, Loader } from "lucide-react"

export default function Home() {
  const [cv, setCv] = useState("")
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  async function buscar() {
    if (!cv) {
      setError("Pegá tu CV antes de buscar")
      return
    }

    setCargando(true)
    setError(null)
    setResultado(null)

    try {
      const res = await fetch("/api/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResultado(data)
      }
    } catch (e) {
      setError("Error al conectar con el servidor")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
      <p className="text-gray-400 mb-8">Buscá ofertas compatibles con tu perfil en Computrabajo</p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <label className="text-sm text-gray-400 block mb-1">Tu CV (pegá el texto)</label>
        <textarea
          className="w-full h-48 bg-gray-800 text-gray-300 rounded-lg p-3 text-sm resize-none border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="Pegá el texto de tu CV acá..."
          value={cv}
          onChange={(e) => setCv(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-xl p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={buscar}
        disabled={cargando}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-6 py-3 rounded-xl transition font-medium mb-8"
      >
        {cargando ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
        {cargando ? "Buscando en Computrabajo..." : "Buscar ofertas"}
      </button>

      {resultado && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Análisis de Claude</h3>
          <div
            className="text-gray-300 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: resultado.analisis }}
          />
        </div>
      )}
    </div>
  )
}