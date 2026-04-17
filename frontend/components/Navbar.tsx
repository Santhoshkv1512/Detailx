'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Our Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--border)] transition-shadow duration-200 ${
          scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.6)]' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display text-xl font-black text-[var(--white)] tracking-widest group-hover:text-[var(--silver)] transition-colors">
                DETAIL
              </span>
              <span className="font-display text-xl font-black text-[var(--green)] tracking-widest">
                X
              </span>
              <span className="w-px h-6 bg-[var(--border-card)] mx-1" />
              <span className="text-xs text-[var(--muted)] font-body tracking-wide hidden sm:block">
                by Ajan
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative font-body text-sm transition-colors duration-200 pb-1 ${
                      isActive
                        ? 'text-[var(--white)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--green)] after:rounded-full'
                        : 'text-[var(--silver)] hover:text-[var(--white)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/book"
                className="font-display text-xs font-bold px-5 py-2.5 rounded-full bg-[var(--green)] text-[var(--bg)] hover:bg-[#25a05e] transition-colors duration-200 tracking-wider"
                style={{ boxShadow: 'var(--green-glow)' }}
              >
                BOOK NOW
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-[var(--silver)] hover:text-[var(--white)] hover:bg-[var(--surface)] transition-colors"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
          {/* Close button */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-black text-[var(--white)]">DETAIL</span>
              <span className="font-display text-xl font-black text-[var(--green)]">X</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-[var(--silver)] hover:text-[var(--white)] hover:bg-[var(--surface)] transition-colors"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 flex flex-col justify-center px-8 gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-2xl py-4 border-b border-[var(--border)] transition-colors ${
                    isActive
                      ? 'text-[var(--green)]'
                      : 'text-[var(--silver)] hover:text-[var(--white)]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile BOOK NOW */}
          <div className="px-8 pb-12">
            <Link
              href="/book"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center font-display text-sm font-bold px-5 py-4 rounded-full bg-[var(--green)] text-[var(--bg)] hover:bg-[#25a05e] transition-colors duration-200 tracking-wider"
              style={{ boxShadow: 'var(--green-glow)' }}
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
