"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [modo, setModo] = useState("login")
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const router = useRouter()

  async function handleSubmit() {
  setCargando(true)
  setError(null)
  setMensaje(null)

  if (modo === "login") {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("Email o contraseña incorrectos")
    } else if (data.session) {
      window.location.href = "/"
    }
  } else {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError("Error al registrarse: " + error.message)
    else setMensaje("¡Cuenta creada! Ya podés iniciar sesión.")
  }

  setCargando(false)
}

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Job Tracker 🎯</h1>
        <p className="text-gray-400 text-sm mb-8">
          {modo === "login" ? "Iniciá sesión para continuar" : "Creá tu cuenta gratis"}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-gray-800 text-gray-300 rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full bg-gray-800 text-gray-300 rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {mensaje && <p className="text-green-400 text-sm">{mensaje}</p>}

          <button
            onClick={handleSubmit}
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-3 rounded-xl font-medium transition"
          >
            {cargando ? "Cargando..." : modo === "login" ? "Iniciar sesión" : "Registrarse"}
          </button>

          <p className="text-center text-sm text-gray-500">
            {modo === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
            <button
              onClick={() => setModo(modo === "login" ? "registro" : "login")}
              className="text-blue-400 hover:underline"
            >
              {modo === "login" ? "Registrate" : "Iniciá sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}