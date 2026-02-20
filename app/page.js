"use client"
import { useState } from "react"
import { Search, Loader, CheckCircle } from "lucide-react"

export default function Home() {
  const [cv, setCv] = useState("")
  const [rol, setRol] = useState("")
  const [ubicacion, setUbicacion] = useState("capital-federal")
  const [categoria, setCategoria] = useState("tecnologia")
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  async function buscar() {
    if (!cv) {
      setError("Pegá tu CV antes de buscar")
      return
    }
    if (!rol) {
      setError("Escribí el rol que estás buscando")
      return
    }

    setCargando(true)
    setError(null)
    setResultado(null)

    try {
      const res = await fetch("/api/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, rol, ubicacion, categoria }),
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

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <label className="text-sm text-gray-400 block mb-1">¿Qué rol buscás?</label>
        <input
          className="w-full bg-gray-800 text-gray-300 rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="Ej: contador, diseñador gráfico, soporte técnico..."
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <label className="text-sm text-gray-400 block mb-2">Categoría</label>
        <select
          className="w-full bg-gray-800 text-gray-300 rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
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

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <label className="text-sm text-gray-400 block mb-2">Ubicación</label>
        <div className="flex gap-3">
          <button
            onClick={() => setUbicacion("capital-federal")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              ubicacion === "capital-federal"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Capital Federal
          </button>
          <button
            onClick={() => setUbicacion("buenos-aires-gba")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              ubicacion === "buenos-aires-gba"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Buenos Aires / GBA
          </button>
        </div>
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
        {cargando ? "Buscando..." : "Buscar ofertas"}
      </button>

      {resultado && (
        <div className="bg-green-900/20 border border-green-700 rounded-xl p-6 flex items-start gap-4">
          <CheckCircle size={24} className="text-green-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-green-400 font-semibold text-lg">{resultado.mensaje}</p>
            <p className="text-gray-400 text-sm mt-1">
              También te mandamos el resumen por Telegram. Hacé clic en{" "}
              <a href="/ofertas" className="text-blue-400 hover:underline font-medium">
                Ofertas
              </a>{" "}
              para ver el listado y marcar las que ya enviaste.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}