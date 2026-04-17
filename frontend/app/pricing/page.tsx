'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchWashPricing } from '@/lib/api'

// ─── Types ───────────────────────────────────────────────────────────────────

interface VehiclePricing {
  small: number
  sedan: number
  muv: number
  luxury: number
}

interface WashPricing {
  basic: VehiclePricing
  standard: VehiclePricing
  premium: VehiclePricing
  ultimate: VehiclePricing
}

interface PricingResponse {
  pricing: WashPricing
  raw: unknown[]
}

type VehicleKey = 'small' | 'sedan' | 'muv' | 'luxury'

// ─── Constants ───────────────────────────────────────────────────────────────

const VEHICLE_TABS: { label: string; value: VehicleKey }[] = [
  { label: 'Small Car', value: 'small' },
  { label: 'Sedan', value: 'sedan' },
  { label: 'MUV / SUV', value: 'muv' },
  { label: 'High-End Luxury', value: 'luxury' },
]

const STUDIO_WHATSAPP = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || '919876543210'

const FALLBACK_PRICING: WashPricing = {
  basic:    { small: 29900, sedan: 34900, muv: 39900, luxury: 49900 },
  standard: { small: 49900, sedan: 59900, muv: 69900, luxury: 89900 },
  premium:  { small: 89900, sedan: 109900, muv: 129900, luxury: 159900 },
  ultimate: { small: 149900, sedan: 179900, muv: 209900, luxury: 259900 },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(paise: number | undefined): string {
  if (paise === undefined || paise === null) return '—'
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FeatureDot({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-[var(--silver)]">
      <span
        className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--green)]"
        aria-hidden="true"
      />
      {text}
    </li>
  )
}

function CardSkeleton() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl p-6 animate-pulse flex flex-col gap-3">
      <div className="w-8 h-8 bg-[var(--border-card)] rounded mb-1" />
      <div className="h-4 bg-[var(--border-card)] rounded w-2/3" />
      <div className="h-8 bg-[var(--border-card)] rounded w-1/2" />
      <div className="h-3 bg-[var(--border-card)] rounded w-1/3" />
      <div className="mt-2 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-3 bg-[var(--border-card)] rounded w-full" />
        ))}
      </div>
      <div className="h-10 bg-[var(--border-card)] rounded-full mt-4" />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [pricing, setPricing] = useState<WashPricing>(FALLBACK_PRICING)
  const [activeVehicle, setActiveVehicle] = useState<VehicleKey>('sedan')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWashPricing()
      .then((data: PricingResponse) => {
        if (data?.pricing) {
          setPricing(data.pricing)
        }
      })
      .catch(() => {
        // FALLBACK_PRICING already set as initial state
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="h-48 flex items-center bg-[var(--bg)] border-b border-[var(--border)] carbon-texture">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <p className="text-sm text-[var(--muted)] mb-3">
            <Link href="/" className="hover:text-[var(--white)] transition-colors duration-200">
              Home
            </Link>
            {' / '}
            <span>Pricing</span>
          </p>
          <h1 className="font-display text-5xl text-[var(--white)] mb-2">PRICING</h1>
          <p className="text-[var(--muted)]">Transparent pricing for every service</p>
        </div>
      </section>

      {/* ── Vehicle Tabs ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-3 flex-wrap">
        {VEHICLE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveVehicle(tab.value)}
            className={[
              'font-display text-xs px-5 py-2 rounded-full cursor-pointer transition-all duration-200',
              activeVehicle === tab.value
                ? 'bg-[var(--green)] text-black'
                : 'border border-[var(--border-card)] text-[var(--silver)] hover:border-[var(--green)] hover:text-[var(--green)]',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Wash Packages Section ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="font-display text-2xl text-[var(--white)] mb-2">Wash Packages</h2>
        <p className="text-[var(--muted)] mb-8">Choose the right level of care for your vehicle</p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* ── BASIC ──────────────────────────────────────────────────── */}
            <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl p-6 hover:border-[var(--green)] transition-all duration-200 flex flex-col">
              <span className="text-3xl mb-4" aria-hidden="true">🚿</span>
              <h3 className="font-display text-lg text-[var(--white)] mb-1">Basic Wash</h3>
              <p className="font-mono text-[var(--green)] text-3xl font-bold leading-tight">
                {formatPrice(pricing.basic?.[activeVehicle])}
              </p>
              <p className="text-[var(--muted)] text-sm mb-6">/ per wash</p>
              <ul className="space-y-2 flex-1">
                <FeatureDot text="Exterior foam wash" />
                <FeatureDot text="Wheel & tyre clean" />
                <FeatureDot text="Glass wipe down" />
                <FeatureDot text="Air freshener" />
                <FeatureDot text="Hand dry finish" />
              </ul>
              <Link
                href="/book?service=premium-body-wash"
                className="mt-6 block w-full text-center border border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)] hover:text-black rounded-full py-3 font-display text-xs transition-all duration-200"
              >
                Book Basic Wash
              </Link>
            </div>

            {/* ── STANDARD ───────────────────────────────────────────────── */}
            <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl p-6 hover:border-[var(--green)] transition-all duration-200 flex flex-col">
              <span className="text-3xl mb-4" aria-hidden="true">✨</span>
              <h3 className="font-display text-lg text-[var(--white)] mb-1">Standard Wash</h3>
              <p className="font-mono text-[var(--green)] text-3xl font-bold leading-tight">
                {formatPrice(pricing.standard?.[activeVehicle])}
              </p>
              <p className="text-[var(--muted)] text-sm mb-3">/ per wash</p>
              <p className="italic text-[var(--muted)] text-xs mb-3">Includes Basic, plus:</p>
              <ul className="space-y-2 flex-1">
                <FeatureDot text="Interior vacuum" />
                <FeatureDot text="Dashboard wipe & condition" />
                <FeatureDot text="Tyre dressing" />
                <FeatureDot text="Door jamb clean" />
                <FeatureDot text="Streak-free windows" />
              </ul>
              <Link
                href="/book?service=premium-body-wash"
                className="mt-6 block w-full text-center border border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)] hover:text-black rounded-full py-3 font-display text-xs transition-all duration-200"
              >
                Book Standard Wash
              </Link>
            </div>

            {/* ── PREMIUM (FEATURED) ─────────────────────────────────────── */}
            <div className="relative bg-[var(--surface)] border-2 border-[var(--green)] rounded-xl p-6 transition-all duration-200 flex flex-col">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--green)] text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                MOST POPULAR
              </span>
              <span className="text-3xl mb-4" aria-hidden="true">💎</span>
              <h3 className="font-display text-lg text-[var(--white)] mb-1">Premium Wash</h3>
              <p className="font-mono text-[var(--green)] text-3xl font-bold leading-tight">
                {formatPrice(pricing.premium?.[activeVehicle])}
              </p>
              <p className="text-[var(--muted)] text-sm mb-3">/ per wash</p>
              <p className="italic text-[var(--muted)] text-xs mb-3">Includes Standard, plus:</p>
              <ul className="space-y-2 flex-1">
                <FeatureDot text="Clay bar decontamination" />
                <FeatureDot text="Hand wax application" />
                <FeatureDot text="Engine bay exterior" />
                <FeatureDot text="Seat & carpet shampoo" />
                <FeatureDot text="Odour neutraliser" />
              </ul>
              <Link
                href="/book?service=premium-body-wash"
                className="mt-6 block w-full text-center bg-[var(--green)] text-black font-bold rounded-full py-3 font-display text-xs hover:brightness-110 transition-all duration-200"
              >
                Book Premium Wash
              </Link>
            </div>

            {/* ── ULTIMATE ───────────────────────────────────────────────── */}
            <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl p-6 hover:border-[var(--green)] transition-all duration-200 flex flex-col">
              <span className="text-3xl mb-4" aria-hidden="true">🔥</span>
              <h3 className="font-display text-lg text-[var(--white)] mb-1">Ultimate Wash</h3>
              <p className="font-mono text-[var(--green)] text-3xl font-bold leading-tight">
                {formatPrice(pricing.ultimate?.[activeVehicle])}
              </p>
              <p className="text-[var(--muted)] text-sm mb-3">/ per wash</p>
              <p className="italic text-[var(--muted)] text-xs mb-3">Includes Premium, plus:</p>
              <ul className="space-y-2 flex-1">
                <FeatureDot text="Ceramic spray coat" />
                <FeatureDot text="Paint sealant" />
                <FeatureDot text="Headlight polish" />
                <FeatureDot text="Leather conditioning" />
                <FeatureDot text="Complete detail report" />
              </ul>
              <Link
                href="/book?service=premium-body-wash"
                className="mt-6 block w-full text-center border border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)] hover:text-black rounded-full py-3 font-display text-xs transition-all duration-200"
              >
                Book Ultimate Wash
              </Link>
            </div>

          </div>
        )}

        <p className="text-[var(--muted)] text-sm text-center mt-6">
          All prices inclusive of GST. Prices may vary based on vehicle condition. Final quote confirmed at studio.
        </p>
      </section>

      {/* ── Dark green strip ─────────────────────────────────────────────── */}
      <section className="bg-[var(--green-dark)] mt-16 py-10 text-center px-4">
        <p className="font-display text-white mb-4">
          Ceramic Coating, PPF &amp; Graphene Coating pricing varies by vehicle and package.
        </p>
        <a
          href={`https://wa.me/${STUDIO_WHATSAPP}?text=Hi%20DetailX%2C%20I%27d%20like%20a%20free%20quote%20for%20Ceramic%20Coating%20or%20PPF.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)] hover:text-black font-display text-xs px-6 py-3 rounded-full transition-all duration-200"
        >
          Get a free quote on WhatsApp →
        </a>
      </section>
    </>
  )
}
