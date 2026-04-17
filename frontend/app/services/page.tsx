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

const categories = [
  { key: 'all', label: 'All' },
  { key: 'wash', label: 'Wash' },
  { key: 'detailing', label: 'Detailing' },
  { key: 'protection', label: 'Protection' },
  { key: 'coating', label: 'Coating' },
]

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins ? `${hrs}h ${mins}m` : `${hrs}h`
}

function ServiceCardSkeleton() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-[var(--border-card)]" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-[var(--border-card)] rounded w-1/4" />
        <div className="h-5 bg-[var(--border-card)] rounded w-3/4" />
        <div className="h-3 bg-[var(--border-card)] rounded w-full" />
        <div className="h-3 bg-[var(--border-card)] rounded w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-[var(--border-card)] rounded w-1/4" />
          <div className="h-8 bg-[var(--border-card)] rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    activeTab === 'all'
      ? services
      : services.filter((s) => s.category === activeTab)

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO — short carbon-texture hero
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative h-64 md:h-80 flex items-center overflow-hidden"
        style={{
          background: 'var(--bg)',
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      >
        {/* Thin green vertical line */}
        <div
          className="absolute left-8 top-0 w-0.5 h-24 bg-[var(--green)]"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          {/* Breadcrumb */}
          <p className="text-[var(--muted)] text-sm mb-4 font-body">
            <Link href="/" className="hover:text-[var(--white)] transition-colors duration-150">
              Home
            </Link>
            {' / '}
            <span>Our Services</span>
          </p>

          <h1 className="font-display text-4xl text-[var(--white)] mb-2">OUR SERVICES</h1>
          <p className="text-[var(--muted)] font-body">Professional car care for every need</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FILTER TABS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 flex-wrap py-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`font-display text-xs px-5 py-2 rounded-full transition-all duration-150 tracking-widest ${
                activeTab === cat.key
                  ? 'bg-[var(--green)] text-black'
                  : 'border border-[var(--border-card)] text-[var(--silver)] hover:border-[var(--green)] hover:text-[var(--green)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SERVICE GRID
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : filtered.map((service) => (
                <div
                  key={service.id}
                  className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl overflow-hidden hover:border-[var(--green)] transition-all duration-200 flex flex-col"
                >
                  {/* Image placeholder */}
                  <div className="h-48 bg-[var(--border-card)] flex items-center justify-center text-[var(--muted)] font-body text-sm">
                    <span>No image</span>
                  </div>

                  {/* Card content */}
                  <div className="p-6 flex flex-col flex-1">

                    {/* Duration badge */}
                    <span className="bg-[var(--border-card)] text-[var(--silver)] text-xs px-2 py-1 rounded-full inline-block mb-3 font-body">
                      {formatDuration(service.duration_minutes)}
                    </span>

                    {/* Name */}
                    <h2 className="font-display text-lg text-[var(--white)] mb-2">
                      {service.name}
                    </h2>

                    {/* Description */}
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-4 font-body flex-1">
                      {service.description}
                    </p>

                    {/* Price + CTA row */}
                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-mono text-[var(--green)] text-lg">
                        {service.base_price
                          ? `From ₹${(service.base_price / 100).toLocaleString('en-IN')}`
                          : 'Get Quote'}
                      </p>
                      <Link
                        href={`/book?service=${service.slug}`}
                        className="border border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)] hover:text-black text-xs px-4 py-2 rounded-full font-display transition-all duration-150 tracking-widest ml-auto"
                      >
                        Book This Service &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--muted)] font-body mb-4">
              No services found in this category.
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="text-[var(--green)] text-sm font-body hover:underline"
            >
              View all services
            </button>
          </div>
        )}
      </div>
    </>
  )
}
