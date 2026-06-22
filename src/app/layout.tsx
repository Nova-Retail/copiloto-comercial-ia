import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Copiloto Comercial IA — NovaRetail',
  description: 'CRM Inteligente con IA — Gestión y scoring de clientes para NovaRetail',
  icons: {
    icon: '/novaretail-icon.svg',
    apple: '/novaretail-icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}
