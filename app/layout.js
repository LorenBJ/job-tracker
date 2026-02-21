"use client"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import Link from "next/link";
import { Briefcase, LayoutDashboard, User, Kanban } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Buscar" },
    { href: "/ofertas", icon: Briefcase, label: "Ofertas" },
    { href: "/seguimiento", icon: Kanban, label: "Seguimiento" },
    { href: "/perfil", icon: User, label: "Mi Perfil" },
  ]

  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif", background: "#0A0F1E" }} className="text-gray-100 antialiased">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside style={{ background: "#0D1424", borderRight: "1px solid rgba(255,255,255,0.06)" }} className="w-56 shrink-0 flex flex-col px-3 py-7">

            {/* Logo */}
            <div className="px-3 mb-8">
              <div className="flex items-center gap-2.5">
                <div style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }} className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg">
                  <Briefcase size={13} className="text-white" />
                </div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-[15px] text-white tracking-tight">
                  Job Tracker
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-0.5 flex-1">
              {navItems.map(({ href, icon: Icon, label }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    style={active ? { background: "rgba(59,130,246,0.12)", color: "#60A5FA" } : {}}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 ${active ? "text-blue-400" : "text-gray-500 hover:text-gray-200 hover:bg-white/5"}`}
                  >
                    <Icon size={15} className={active ? "text-blue-400" : "text-gray-600"} />
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="px-3 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[11px] text-gray-700 mb-3">v1.0 · Potenciado con IA</p>
              <button
                onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login" }}
                className="text-[12px] text-red-500/50 hover:text-red-400 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>

          {/* Main */}
          <main style={{ background: "#0A0F1E" }} className="flex-1 overflow-auto">
            <div className="max-w-2xl mx-auto px-8 py-10">
              {children}
            </div>
          </main>

        </div>
        <Analytics />
      </body>
    </html>
  )
}