'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Bot, ChevronRight, Zap, Package, TrendingUp } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/products', label: 'Productos', icon: Package },
  { href: '/opportunities', label: 'Oportunidades', icon: TrendingUp },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shrink-0">
      <div className="px-6 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Copiloto IA</p>
            <p className="text-xs text-slate-400 mt-0.5">CRM Inteligente</p>
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

      <div className="px-4 py-4 border-t border-slate-700">
        <div className="bg-indigo-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300">NovaRetail</span>
          </div>
          <p className="text-xs text-slate-400">IA activada</p>
        </div>
      </div>
    </aside>
  )
}
