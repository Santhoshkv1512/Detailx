'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getBookingStatus } from '@/lib/api'

const STUDIO_PHONE = process.env.NEXT_PUBLIC_STUDIO_PHONE || '+91 98765 43210'
const STUDIO_WHATSAPP = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || '919876543210'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!ref) { setError('No booking reference found.'); setLoading(false); return }
    getBookingStatus(ref)
      .then(setBooking)
      .catch(() => setError('Could not load booking details.'))
      .finally(() => setLoading(false))
  }, [ref])

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error || !booking) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-[var(--white)] font-display mb-2">Booking Not Found</p>
        <p className="text-[var(--muted)] text-sm mb-6">{error || 'Please check your reference number.'}</p>
        <Link href="/book" className="bg-[var(--green)] text-black font-display text-xs px-6 py-3 rounded-full">BOOK AGAIN</Link>
      </div>
    </div>
  )

  const slot = booking.slot
  const slotDate = slot?.date ? new Date(slot.date).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }) : 'N/A'

  const isPickup = booking.deliveryType === 'pickup'

  return (
    <div className="min-h-screen bg-[var(--bg)] py-16 px-4">
      <div className="max-w-lg mx-auto text-center">

        {/* Animated checkmark */}
        <div className="w-24 h-24 rounded-full bg-[var(--green-dark)] border-2 border-[var(--green)] flex items-center justify-center mx-auto mb-6 animate-check">
          <svg className="w-12 h-12 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display text-4xl text-[var(--green)] mb-2">YOU'RE BOOKED!</h1>
        <p className="text-[var(--muted)] mb-8">Confirmation sent to your WhatsApp.</p>

        {/* Booking reference card */}
        <div className="bg-[var(--surface)] border border-[var(--border-card)] border-t-2 border-t-[var(--green)] rounded-xl p-6 text-left mb-6">
          <div className="text-center mb-5">
            <span className="font-mono text-[var(--green)] text-lg font-bold">#{booking.reference}</span>
            <p className="text-[var(--muted)] text-xs mt-1">Booking Reference</p>
          </div>

          <div className="space-y-3 text-sm">
            <Row label="Service" value={booking.service?.name} />
            <Row label="Date" value={slotDate} />
            <Row label="Time" value={slot?.time} />
            <Row label="Vehicle" value={`${booking.carYear} ${booking.carMake} ${booking.carModel}`} />
            <Row label="Reg No" value={booking.registrationNumber} mono />
            <Row label="Delivery" value={isPickup ? '🏠 Pickup requested' : '🚗 Drop-off at studio'} />
          </div>

          <div className="border-t border-[var(--border-card)] mt-4 pt-4 space-y-2 text-sm">
            <Row label="Deposit Paid" value={`₹${(booking.depositPaise / 100).toLocaleString('en-IN')}`} green />
            <Row label="Balance at Studio" value={`₹${(booking.balancePaise / 100).toLocaleString('en-IN')}`} muted />
          </div>
        </div>

        {/* Pickup amber notice */}
        {isPickup && (
          <div className="bg-[var(--amber-bg)] border-l-4 border-[var(--amber)] rounded-r-lg p-4 text-left mb-6">
            <p className="text-[var(--amber)] text-sm">⚠ Our team will call you within 2 hours to confirm your pickup time.</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-center flex-wrap mb-6">
          <a
            href={`https://wa.me/${STUDIO_WHATSAPP}?text=Hi%20DetailX%2C%20my%20booking%20ref%20is%20${booking.reference}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white font-display text-xs px-6 py-3 rounded-full hover:brightness-110 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            CHAT ON WHATSAPP
          </a>
          <Link href="/" className="border border-[var(--border-card)] text-[var(--silver)] font-display text-xs px-6 py-3 rounded-full hover:border-[var(--silver)] transition-all">
            BACK TO HOME
          </Link>
        </div>

        <p className="text-[var(--muted)] text-sm">Questions? Call us: <a href={`tel:${STUDIO_PHONE}`} className="text-[var(--green)] hover:underline">{STUDIO_PHONE}</a></p>
      </div>
    </div>
  )
}

function Row({ label, value, mono, green, muted }: { label: string; value: any; mono?: boolean; green?: boolean; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)] shrink-0">{label}</span>
      <span className={`text-right ${mono ? 'font-mono' : ''} ${green ? 'text-[var(--green)] font-bold' : muted ? 'text-[var(--muted)]' : 'text-[var(--white)]'}`}>
        {value ?? '—'}
      </span>
    </div>
  )
}
