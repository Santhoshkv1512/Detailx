'use client'

import Link from 'next/link'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Our Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Now', href: '/book' },
]

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_STUDIO_PHONE
  const whatsapp = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || '919876543210'

  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--green)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* ── Left col: Brand ── */}
          <div>
            <div className="flex items-center gap-1 mb-3">
              <span className="font-display text-xl font-black text-[var(--white)]">DETAIL</span>
              <span className="font-display text-xl font-black text-[var(--green)]">X</span>
            </div>
            <p className="font-body italic text-[var(--silver)] text-sm">
              Precision. Protection. Perfection.
            </p>
          </div>

          {/* ── Center col: Quick Links ── */}
          <div>
            <h3 className="font-display text-xs tracking-widest text-[var(--silver)] mb-4">
              QUICK LINKS
            </h3>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] hover:text-[var(--white)] block py-1 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right col: Get In Touch ── */}
          <div>
            <h3 className="font-display text-xs tracking-widest text-[var(--silver)] mb-4">
              GET IN TOUCH
            </h3>
            <div className="space-y-3">

              {/* Address */}
              <p className="text-sm text-[var(--silver)] flex items-start gap-2">
                <span aria-hidden="true">📍</span>
                <span>DetailX Studio, Kochi, Kerala</span>
              </p>

              {/* Phone */}
              {phone && (
                <p>
                  <a
                    href={`tel:${phone}`}
                    className="text-sm text-[var(--silver)] hover:text-[var(--white)] transition-colors duration-150"
                  >
                    {phone}
                  </a>
                </p>
              )}

              {/* WhatsApp button */}
              <div>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[var(--green)] text-[var(--green)] rounded-full px-4 py-2 text-sm hover:bg-[var(--green)] hover:text-black inline-flex items-center gap-2 transition-colors duration-150"
                >
                  {/* WhatsApp icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>

              {/* Instagram icon link */}
              <div>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="text-[var(--silver)] hover:text-[var(--white)] transition-colors duration-150 inline-block"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--muted)]">
            &copy; 2026 Detail X by Ajan &middot; Kochi, Kerala
          </p>
          <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
            <Link href="/privacy" className="hover:text-[var(--white)] transition-colors duration-150">
              Privacy Policy
            </Link>
            <span aria-hidden="true">&middot;</span>
            <Link href="/terms" className="hover:text-[var(--white)] transition-colors duration-150">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
