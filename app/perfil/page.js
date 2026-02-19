export default function Perfil() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Mi Perfil</h2>
      <p className="text-gray-400 mb-8">Configurá tu CV y preferencias de búsqueda</p>

      <div className="grid grid-cols-2 gap-6">

        {/* CV */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Tu CV</h3>
          <textarea
            className="w-full h-48 bg-gray-800 text-gray-300 rounded-lg p-3 text-sm resize-none border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Pegá el texto de tu CV acá..."
          />
          <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Guardar CV
          </button>
        </div>

        {/* Preferencias */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Preferencias de búsqueda</h3>
          
          <label className="text-sm text-gray-400">Posiciones que buscás</label>
          <input
            className="w-full bg-gray-800 text-gray-300 rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 mt-1 mb-4"
            placeholder="Ej: Desarrollador Web, Frontend, React"
          />

          <label className="text-sm text-gray-400">Ubicación</label>
          <input
            className="w-full bg-gray-800 text-gray-300 rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 mt-1 mb-4"
            placeholder="Ej: Buenos Aires, Remoto"
          />

          <label className="text-sm text-gray-400">Palabras clave</label>
          <input
            className="w-full bg-gray-800 text-gray-300 rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 mt-1 mb-4"
            placeholder="Ej: React, Node.js, TypeScript"
          />

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Guardar preferencias
          </button>
        </div>

      </div>
    </div>
  )
}