import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Briefcase, User, Search } from "lucide-react";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Job Tracker",
  description: "Tu asistente de búsqueda laboral",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-gray-950 text-white`}>
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-56 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-2">
            <h1 className="text-xl font-bold text-blue-400 mb-6">Job Tracker 🎯</h1>
            <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
              <Search size={18} /> Dashboard
            </Link>
            <Link href="/ofertas" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
              <Briefcase size={18} /> Ofertas
            </Link>
            <Link href="/perfil" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
              <User size={18} /> Mi Perfil
            </Link>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 p-8 bg-gray-950">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}