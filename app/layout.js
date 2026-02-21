"use client"
import "./globals.css";
import Link from "next/link";
import { Briefcase, LayoutDashboard, User, Kanban } from "lucide-react";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif" }} className="bg-[#080C14] text-gray-100 antialiased">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-60 shrink-0 border-r border-white/5 flex flex-col px-4 py-8" style={{ background: "linear-gradient(180deg, #0D1117 0%, #080C14 100%)" }}>

            {/* Logo */}
            <div className="px-3 mb-10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Briefcase size={14} className="text-white" />
                </div>
                <span style={{ fontFamily: "'Syne', sans-serif" }} className="text-[15px] font-700 tracking-tight text-white">
                  Job Tracker
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-0.5 flex-1">
              {[
                { href: "/", icon: LayoutDashboard, label: "Buscar" },
                { href: "/ofertas", icon: Briefcase, label: "Ofertas" },
                { href: "/seguimiento", icon: Kanban, label: "Seguimiento" },
                { href: "/perfil", icon: User, label: "Mi Perfil" },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150 group"
                >
                  <Icon size={15} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-3 pt-6 border-t border-white/5">
              <p className="text-[11px] text-gray-600 mb-3">v1.0 · Búsqueda potenciada con IA</p>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.href = "/login"
                }}  
                className="text-[12px] text-red-500/60 hover:text-red-400 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>

          </aside>

          {/* Main */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-3xl mx-auto px-8 py-10">
              {children}
            </div>
          </main>

        </div>
      </body>
    </html>
  );
}