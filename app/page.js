// app/page.js
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

  const inputClass = "w-full bg-white/[0.03] text-gray-200 rounded-xl px-4 py-3 text-sm border border-white/8 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-600"
  const cardClass = "bg-white/[0.02] border border-white/6 rounded-2xl p-6 mb-4"

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-blue-400" />
          <span className="text-xs text-blue-400 font-medium tracking-widest uppercase">IA · Computrabajo</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl font-800 text-white tracking-tight mb-2">
          Buscar ofertas
        </h1>
        <p className="text-gray-500 text-sm">Claude analiza las ofertas y filtra las más compatibles con tu perfil.</p>
      </div>

      {/* CV */}
      <div className={cardClass}>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-3">Tu CV</label>
        <textarea
          className={`${inputClass} h-44 resize-none`}
          placeholder="Pegá el texto de tu CV acá..."
          value={cv}
          onChange={(e) => setCv(e.target.value)}
        />
      </div>

      {/* Rol */}
      <div className={cardClass}>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-3">Rol buscado</label>
        <input
          className={inputClass}
          placeholder="Ej: soporte técnico, diseñador UX, contador..."
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        />
      </div>

      {/* Categoría y Ubicación */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`${cardClass} mb-0`}>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-3">Categoría</label>
          <select className={inputClass} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
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

        <div className={`${cardClass} mb-0`}>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-3">Ubicación</label>
          <div className="flex flex-col gap-2">
            {[["capital-federal", "Capital Federal"], ["buenos-aires-gba", "Buenos Aires / GBA"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setUbicacion(val)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  ubicacion === val
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "bg-white/[0.03] text-gray-500 border border-white/6 hover:text-gray-300"
                }`}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={buscar}
        disabled={cargando}
        className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 text-white text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 mb-8"
      >
        {cargando ? <Loader size={15} className="animate-spin" /> : <Search size={15} />}
        {cargando ? "Analizando con IA..." : "Buscar ofertas compatibles"}
      </button>

      {resultado && (
        <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
            <CheckCircle size={16} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-emerald-400 font-medium mb-1">{resultado.mensaje}</p>
            <p className="text-gray-500 text-sm">
              Resumen enviado por Telegram · <a href="/ofertas" className="text-blue-400 hover:text-blue-300 transition-colors">Ver en Ofertas →</a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}