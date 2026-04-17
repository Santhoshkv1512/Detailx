'use client'

import { useState } from 'react'

// ─── Constants ───────────────────────────────────────────────────────────────

const STUDIO_PHONE = process.env.NEXT_PUBLIC_STUDIO_PHONE || '+91 98765 43210'
const STUDIO_WHATSAPP = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || '919876543210'
const STUDIO_ADDRESS =
  process.env.NEXT_PUBLIC_STUDIO_ADDRESS || 'DetailX Studio, Kochi, Kerala'
const STUDIO_INSTAGRAM =
  process.env.NEXT_PUBLIC_STUDIO_INSTAGRAM || 'https://instagram.com/detailxbyajan'

const SERVICE_OPTIONS = [
  'Exterior Wash',
  'Interior Detailing',
  'Full Detailing',
  'Ceramic Coating',
  'Paint Protection Film (PPF)',
  'Graphene Coating',
  'Paint Correction',
  'Underbody Coating',
]

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormState {
  name: string
  phone: string
  carModel: string
  service: string
  message: string
}

const INITIAL_FORM: FormState = {
  name: '',
  phone: '',
  carModel: '',
  service: '',
  message: '',
}

// ─── Instagram SVG icon ───────────────────────────────────────────────────────

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

// ─── Input class ─────────────────────────────────────────────────────────────

const inputClass =
  'bg-[var(--surface)] border border-[var(--border-card)] focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] focus:outline-none text-[var(--white)] rounded-lg px-4 py-3 w-full placeholder-[var(--muted)] transition-colors duration-200'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="h-64 flex items-center carbon-texture bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="font-display text-4xl text-[var(--white)] mb-2">CONTACT US</h1>
          <p className="text-[var(--muted)]">We&apos;d love to hear from you</p>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-16">

        {/* ── Left col: Contact info ──────────────────────────────────────── */}
        <div>
          <h3 className="font-display text-[var(--white)] text-lg mb-6">Visit Us</h3>

          {/* Address + phone card */}
          <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-lg p-6 mb-6">
            {/* Studio address */}
            <p className="font-display text-xs tracking-widest text-[var(--green)] mb-1">
              📍 DetailX Studio
            </p>
            <p className="text-[var(--silver)] text-sm mb-4">{STUDIO_ADDRESS}</p>

            {/* Phone */}
            <p className="font-display text-xs tracking-widest text-[var(--green)] mb-1">
              📞 Call Us
            </p>
            <a
              href={`tel:${STUDIO_PHONE}`}
              className="text-[var(--silver)] hover:text-white transition-colors duration-200 text-sm"
            >
              {STUDIO_PHONE}
            </a>

            {/* Separator */}
            <div className="border-t border-[var(--border-card)] my-4" />

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${STUDIO_WHATSAPP}?text=Hi%20DetailX%2C%20I%20have%20an%20enquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white rounded-full px-4 py-2 text-sm mt-4 w-fit"
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
              WhatsApp Us
            </a>

            {/* Instagram */}
            <a
              href={STUDIO_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--silver)] hover:text-[var(--white)] transition-colors duration-200 mt-2"
            >
              <InstagramIcon className="w-4 h-4" />
              Follow us on Instagram
            </a>
          </div>

          {/* Opening hours card */}
          <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-lg p-6 mb-6">
            <p className="font-display text-xs tracking-widest text-[var(--green)] mb-4">
              OPENING HOURS
            </p>
            <div className="flex justify-between text-[var(--silver)] text-sm mb-2">
              <span>Mon – Sat</span>
              <span>9:00 AM – 7:00 PM</span>
            </div>
            <div className="flex justify-between text-[var(--silver)] text-sm">
              <span>Sunday</span>
              <span>10:00 AM – 5:00 PM</span>
            </div>
          </div>

          {/* Google Maps embed */}
          <div className="rounded-lg overflow-hidden border border-[var(--border-card)] mt-6">
            <iframe
              title="DetailX Studio Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31424.45867745455!2d76.24107515!3d10.0159539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d514abec6bf%3A0xbd582caa5f6c2fd1!2sKochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* ── Right col: Enquiry form ─────────────────────────────────────── */}
        <div>
          <h3 className="font-display text-[var(--white)] text-lg mb-6">Send an Enquiry</h3>

          {submitted ? (
            /* ── Success state ────────────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--green-dark)] border-2 border-[var(--green)] flex items-center justify-center animate-check">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[var(--green)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-sm text-[var(--white)] mb-2">
                  ENQUIRY SENT!
                </h4>
                <p className="text-[var(--muted)] text-sm">
                  Thank you! Our team will get back to you shortly.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setForm(INITIAL_FORM)
                }}
                className="text-[var(--green)] text-sm hover:underline mt-2"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            /* ── Form ─────────────────────────────────────────────────────── */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs text-[var(--silver)] mb-1.5">
                  Full Name <span className="text-[var(--green)]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-[var(--silver)] mb-1.5">
                  Phone Number <span className="text-[var(--green)]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="bg-[var(--surface)] border border-[var(--border-card)] text-[var(--muted)] rounded-lg px-4 py-3 text-sm shrink-0">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Car Model */}
              <div>
                <label className="block text-xs text-[var(--silver)] mb-1.5">Car Model</label>
                <input
                  type="text"
                  name="carModel"
                  value={form.carModel}
                  onChange={handleChange}
                  placeholder="e.g. Honda City ZX 2022"
                  className={inputClass}
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-xs text-[var(--silver)] mb-1.5">
                  Service Interested In
                </label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs text-[var(--silver)] mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your car or any specific requirements..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[var(--green)] text-black font-display text-xs font-bold py-4 rounded-full hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ boxShadow: 'var(--green-glow)' }}
              >
                {submitting ? 'Sending...' : 'SEND ENQUIRY'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
