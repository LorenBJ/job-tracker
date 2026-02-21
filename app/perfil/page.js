"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Upload, Save, Loader, CheckCircle } from "lucide-react"

export default function Perfil() {
  const [cvTexto, setCvTexto] = useState("")
  const [rol, setRol] = useState("")
  const [categoria, setCategoria] = useState("tecnologia")
  const [ubicacion, setUbicacion] = useState("capital-federal")
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [extrayendo, setExtrayendo] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    cargarPerfil()
  }, [])

  async function cargarPerfil() {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("perfiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

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

    await supabase
      .from("perfiles")
      .upsert({
        user_id: user.id,
        cv_texto: cvTexto,
        rol,
        categoria,
        ubicacion,
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

    const res = await fetch("/api/extraer-pdf", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    if (data.texto) setCvTexto(data.texto)
    setExtrayendo(false)
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
      <h2 className="text-2xl font-bold text-white mb-1">Mi Perfil</h2>
      <p className="text-gray-400 mb-8">Configurá tu CV y preferencias para búsquedas automáticas</p>

      <div className="grid grid-cols-1 gap-6">

        {/* CV */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-blue-400 font-semibold mb-4">Tu CV</h3>

          <div className="mb-4">
            <label className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2.5 rounded-lg cursor-pointer transition w-fit border border-gray-700">
              {extrayendo
                ? <><Loader size={15} className="animate-spin" /> Extrayendo texto...</>
                : <><Upload size={15} /> Subir PDF</>
              }
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={extraerPDF}
                disabled={extrayendo}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">El texto del PDF se cargará automáticamente abajo</p>
          </div>

          <textarea
            className="w-full h-64 bg-gray-800 text-gray-300 rounded-lg p-3 text-sm resize-none border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Pegá el texto de tu CV acá o subí un PDF..."
            value={cvTexto}
            onChange={(e) => setCvTexto(e.target.value)}
          />
        </div>

        {/* Preferencias */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-blue-400 font-semibold mb-4">Preferencias de búsqueda</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">¿Qué rol buscás?</label>
              <input
                className="w-full bg-gray-800 text-gray-300 rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="Ej: soporte técnico, contador, diseñador..."
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              />
            </div>

            <div>
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

            <div>
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
          </div>
        </div>

        <button
          onClick={guardarPerfil}
          disabled={guardando}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-6 py-3 rounded-xl transition font-medium w-fit"
        >
          {guardado
            ? <><CheckCircle size={18} /> Guardado</>
            : guardando
            ? <><Loader size={18} className="animate-spin" /> Guardando...</>
            : <><Save size={18} /> Guardar perfil</>
          }
        </button>

      </div>
    </div>
  )
}