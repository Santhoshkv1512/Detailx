'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Bookings', href: '/admin/bookings', icon: '📅' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('dx_admin_token')
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login')
    } else {
      setReady(true)
    }
  }, [pathname])

  if (pathname === '/admin/login') return <>{children}</>
  if (!ready) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  function handleLogout() {
    localStorage.removeItem('dx_admin_token')
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#0D0D0D] border-r border-[var(--border)] flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-1">
            <span className="font-display text-lg font-black text-[var(--white)]">DETAIL</span>
            <span className="font-display text-lg font-black text-[var(--green)]">X</span>
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-0.5 font-display tracking-widest">ADMIN</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                  ${active ? 'border-l-[3px] border-[var(--green)] bg-[var(--green-dark)] text-[var(--white)] pl-[9px]' : 'text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--surface)]'}`}>
                <span>{item.icon}</span>
                <span className="font-body">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-[var(--border)]">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--surface)] transition-all">
            <span>🚪</span><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-[var(--bg)]">
        {children}
      </main>
    </div>
  )
}
