"use client"
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Briefcase, User, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-gray-950 text-gray-100`}>
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 border-r border-gray-800 px-6 py-8 flex flex-col">
            
            {/* Logo */}
            <h1 className="text-2xl font-semibold text-blue-400 mb-10 tracking-tight">
              Job Tracker 🎯
            </h1>

            {/* Navigation */}
            <nav className="space-y-2 text-sm">
              
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition"
              >
                <Search size={18} />
                Dashboard
              </Link>

              <Link
                href="/ofertas"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition"
              >
                <Briefcase size={18} />
                Ofertas
              </Link>

              <Link
                href="/perfil"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition"
              >
                <User size={18} />
                Mi Perfil
              </Link>

            </nav>

            {/* Footer sidebar */}
            <div className="mt-auto pt-8 text-xs text-gray-500 space-y-3">
              <p>Hecho para optimizar tu búsqueda laboral 🚀</p>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.href = "/login"
                }}
                className="text-red-400 hover:text-red-300 transition"
              >
                Cerrar sesión
              </button>
            </div>

          </aside>

          {/* Main content */}
          <main className="flex-1 bg-gray-950 px-6 md:px-10 py-10">
            <div className="max-w-4xl mx-auto space-y-8">
              {children}
            </div>
          </main>

        </div>
      </body>
    </html>
  );
}