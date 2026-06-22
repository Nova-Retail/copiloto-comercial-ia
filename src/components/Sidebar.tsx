'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Users, ChevronRight, Zap, Package, TrendingUp, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/products', label: 'Productos', icon: Package },
  { href: '/opportunities', label: 'Oportunidades', icon: TrendingUp },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shrink-0">
      <div className="px-6 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <Image
            src="/novaretail-icon.svg"
            alt="NovaRetail"
            width={34}
            height={34}
            className="rounded-lg"
          />
          <div>
            <p className="text-sm font-bold text-white leading-none">NovaRetail</p>
            <p className="text-xs text-slate-400 mt-0.5">Copiloto Comercial IA</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700 space-y-3">
        <div className="bg-indigo-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300">IA activada</span>
          </div>
          <p className="text-xs text-slate-400">Anthropic Claude AI</p>
        </div>

        {email && (
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <p className="text-xs text-slate-500 leading-none mb-1">Sesión activa</p>
              <p className="text-xs text-slate-300 truncate">{email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}