'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchServices } from '@/lib/api'

interface Service {
  id: string
  slug: string
  name: string
  description: string
  base_price: number
  duration_minutes: number
  category: string
}

// ── Inline car SVG icon ──────────────────────────────────────────────────────
function CarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={32}
      height={32}
      aria-hidden="true"
    >
      <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  )
}

// ── Service card skeleton ────────────────────────────────────────────────────
function ServiceCardSkeleton() {
  return (
    <div className="animate-pulse bg-[var(--border-card)] h-48 rounded-lg" />
  )
}

// ── Static testimonials ──────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Rahul Menon',
    stars: '★★★★★',
    review:
      'Best detailing studio in Kochi! My car looks brand new after the ceramic coating. Ajan and his team are absolute professionals.',
    car: 'Hyundai Creta Owner',
  },
  {
    name: 'Priya Nair',
    stars: '★★★★★',
    review:
      'The interior deep cleaning was outstanding. They removed stains I thought were permanent. Highly recommended for anyone serious about their car.',
    car: 'Maruti Swift Owner',
  },
  {
    name: 'Arun Kumar',
    stars: '★★★★★',
    review:
      'Got the Premium wash package. Incredible attention to detail. The team uses quality products and takes time to do it right.',
    car: 'Toyota Innova Owner',
  },
]

// ── Package pills data ───────────────────────────────────────────────────────
const washPackages = ['Basic', 'Standard', 'Premium', 'Ultimate']

// ── Stats data ───────────────────────────────────────────────────────────────
const stats = [
  { number: '500+', label: 'Cars Detailed' },
  { number: '5 ★', label: 'Google Rating' },
  { number: '3 Yrs', label: 'Serving Kochi' },
]

// ── Check list items ─────────────────────────────────────────────────────────
const checkItems = [
  'Certified equipment & professional-grade products',
  'Experienced technicians with 5+ years expertise',
  'Complete car care from wash to ceramic coating',
  'Transparent pricing with no hidden charges',
]

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  const waNumber = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || '919876543210'

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">

        {/* Hero car background image */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/hero-car.jpg')", opacity: 0.35 }}
          aria-hidden="true"
        />

        {/* Left-to-right dark gradient so text stays legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(100deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.75) 50%, rgba(10,10,10,0.2) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Subtle carbon-fibre texture */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
          aria-hidden="true"
        />

        {/* Thin green vertical decorative line */}
        <div
          className="absolute left-8 top-0 w-0.5 h-32 bg-[var(--green)]"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-24 md:py-0">
          <div className="max-w-2xl">

            {/* Overline */}
            <p className="font-display text-[var(--silver)] text-xs tracking-[0.3em] mb-4">
              KOCHI&apos;S PREMIUM DETAILING STUDIO
            </p>

            {/* H1 */}
            <h1 className="font-display font-black text-5xl md:text-7xl leading-none mb-6">
              <span className="block text-[var(--white)]">PROTECT WHAT</span>
              <span className="block text-[var(--white)]">
                YOU{' '}
                <span className="text-[var(--green)]">LOVE.</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-body text-lg text-[var(--muted)] max-w-lg mb-8">
              Ceramic coating, paint protection, and complete car care &mdash; delivered with precision.
            </p>

            {/* Buttons row */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="font-display text-xs font-bold px-6 py-3 rounded-full bg-[var(--green)] text-black hover:brightness-110 transition-all duration-200 tracking-widest"
                style={{ boxShadow: 'var(--green-glow)' }}
              >
                BOOK A SERVICE
              </Link>
              <Link
                href="/services"
                className="font-display text-xs px-6 py-3 rounded-full border border-[var(--silver)] text-[var(--silver)] hover:border-[var(--white)] hover:text-[var(--white)] transition-colors duration-200 tracking-widest"
              >
                VIEW SERVICES
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 max-w-sm border-t border-[var(--border)] pt-8 mt-16 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t-2 border-[var(--green)] pt-4">
                <p className="font-display text-3xl text-[var(--white)]">{stat.number}</p>
                <p className="text-sm text-[var(--muted)] mt-1 font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — SERVICES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--surface)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <p className="font-display text-[var(--green)] text-xs tracking-widest">WHAT WE OFFER</p>
          <h2 className="font-display text-3xl text-[var(--white)] mt-2 mb-2">
            Providing All Types of Car Detailing Services
          </h2>
          <p className="text-[var(--muted)] font-body mb-12">DetailX Premium Car Detailing</p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
              : services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-[var(--bg)] border border-[var(--border-card)] rounded-lg p-6 hover:border-[var(--green)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
                  >
                    {/* Car icon */}
                    <div className="text-[var(--silver)]">
                      <CarIcon />
                    </div>

                    {/* Name */}
                    <h3 className="font-display text-sm text-[var(--white)] mt-4 mb-2">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 font-body line-clamp-3 flex-1">
                      {service.description}
                    </p>

                    {/* Price */}
                    <p className="font-mono text-[var(--green)] text-sm mb-4">
                      {service.base_price
                        ? `From ₹${(service.base_price / 100).toLocaleString('en-IN')}`
                        : 'Get Quote'}
                    </p>

                    {/* Learn more */}
                    <Link
                      href="/services"
                      className="text-[var(--green)] text-sm hover:underline font-body"
                    >
                      Learn More &rarr;
                    </Link>
                  </div>
                ))}
          </div>

          {/* View all */}
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="text-[var(--green)] hover:underline font-body text-sm"
            >
              View All Services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — ABOUT PREVIEW
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left: image placeholder */}
            <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl h-72 flex items-center justify-center flex-col gap-3">
              <div className="text-[var(--muted)]">
                <CarIcon />
              </div>
              <p className="text-[var(--muted)] text-sm font-body">Car Detailing Studio</p>
            </div>

            {/* Right: content */}
            <div>
              <p className="font-display text-[var(--green)] text-xs tracking-widest mb-3">
                OUR EXPERTISE
              </p>
              <h3 className="font-display text-2xl text-[var(--white)] mb-4">
                DetailX: Where Precision Meets Passion
              </h3>
              <p className="text-[var(--muted)] font-body mb-6">
                We combine industry-leading products with expert craftsmanship to deliver results that
                exceed expectations. Every vehicle we touch receives personalised attention and care.
              </p>

              {/* Check items */}
              <ul className="space-y-3 mb-6">
                {checkItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-sm text-[var(--silver)]">
                    <span className="text-[var(--green)] font-bold mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/about"
                className="border border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)] hover:text-black font-display text-xs px-6 py-3 rounded-full inline-block mt-6 transition-all duration-200 tracking-widest"
              >
                LEARN MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 — PRICING STRIP
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--green-dark)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl text-[var(--white)] mb-8">
            Wash Packages from &#8377;299
          </h2>

          {/* Package pills */}
          <div className="flex gap-3 justify-center flex-wrap">
            {washPackages.map((pkg) => (
              <span
                key={pkg}
                className="border border-[var(--border-card)] text-[var(--silver)] hover:border-[var(--green)] hover:text-[var(--green)] px-5 py-2 rounded-full text-sm font-display transition-colors duration-150 cursor-default"
              >
                {pkg}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/pricing"
            className="mt-8 inline-block border border-[var(--white)] text-[var(--white)] hover:bg-white hover:text-black px-6 py-3 rounded-full font-display text-xs transition-all duration-200 tracking-widest"
          >
            SEE FULL PRICING &rarr;
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5 — TESTIMONIALS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="font-display text-3xl text-center mb-12 text-[var(--white)]">
            What Our Customers Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[var(--bg)] border border-[var(--border-card)] rounded-lg p-6"
              >
                <p className="font-display text-sm text-[var(--white)] mb-1">{t.name}</p>
                <p className="text-[var(--green)] text-lg mb-3">{t.stars}</p>
                <p className="text-[var(--muted)] text-sm leading-relaxed mb-4 font-body">
                  &ldquo;{t.review}&rdquo;
                </p>
                <p className="text-xs text-[var(--muted)] font-body">{t.car}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6 — CTA BANNER
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 text-center bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl md:text-5xl text-[var(--white)] mb-4">
            READY TO TRANSFORM YOUR CAR?
          </h2>
          <p className="text-[var(--muted)] font-body mb-8">
            Book your appointment today and experience the DetailX difference.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            {/* Book Now */}
            <Link
              href="/book"
              className="bg-[var(--green)] text-black font-display text-xs font-bold px-8 py-4 rounded-full hover:brightness-110 transition-all duration-200 tracking-widest"
              style={{ boxShadow: 'var(--green-glow)' }}
            >
              BOOK NOW
            </Link>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)] hover:text-black font-display text-xs px-8 py-4 rounded-full flex items-center gap-2 transition-all duration-200 tracking-widest"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              CHAT ON WHATSAPP
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
