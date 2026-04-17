import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────────────

const whyChooseItems = [
  {
    icon: '🏆',
    title: 'Certified Equipment',
    description:
      'We use state-of-the-art detailing equipment and professional-grade machines to deliver consistent, showroom-quality results.',
  },
  {
    icon: '👨‍🔧',
    title: 'Expert Technicians',
    description:
      'Our team brings 5+ years of hands-on detailing experience with continuous training on the latest techniques and products.',
  },
  {
    icon: '⭐',
    title: 'Premium Products',
    description:
      'Only globally certified, paint-safe compounds, coatings, and protective films from trusted brands are used on your vehicle.',
  },
]

const servicesGrid = [
  { icon: '🚿', label: 'Wash' },
  { icon: '🔧', label: 'Detailing' },
  { icon: '🛡️', label: 'Underbody Coating' },
  { icon: '🪑', label: 'Interior Deep Clean' },
  { icon: '✨', label: 'Waxing' },
  { icon: '🎬', label: 'PPF' },
  { icon: '🏎️', label: 'Paint Protection' },
  { icon: '🔄', label: 'Rubbing Polish' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative h-80 flex items-center bg-[var(--bg)] border-b border-[var(--border)] overflow-hidden">
        {/* Carbon texture overlay */}
        <div
          className="absolute inset-0 carbon-texture pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="font-display text-4xl text-[var(--white)] mb-2">
            DetailX Premium Car Detailing
          </h1>
          <p className="text-[var(--muted)] mt-2">
            Kochi&apos;s most trusted detailing studio
          </p>
        </div>
      </section>

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16 items-center">
        {/* Left: image placeholder */}
        <div className="h-80 bg-[var(--surface)] border border-[var(--border-card)] rounded-xl flex items-center justify-center text-[var(--muted)]">
          Car Detailing Studio
        </div>

        {/* Right: content */}
        <div>
          <p className="font-display text-[var(--green)] text-xs tracking-widest mb-1">
            OUR EXPERTISE
          </p>
          <h2 className="font-display text-3xl text-[var(--white)] my-3">
            Where Precision Meets Passion
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Detail X by Ajan was founded with a single vision — to bring world-class automotive
            detailing to Kochi. We use only certified products from trusted global brands, operated
            by technicians who genuinely care about your vehicle. Whether it&apos;s a daily driver
            or a prized possession, we treat every car with the same level of dedication and
            craftsmanship.
          </p>
          <Link
            href="/book"
            className="bg-[var(--green)] text-black font-display text-xs px-6 py-3 rounded-full mt-6 inline-block"
            style={{ boxShadow: 'var(--green-glow)' }}
          >
            BOOK A SERVICE
          </Link>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
      <section className="bg-[var(--surface)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-[var(--white)] mb-12 text-center">
            Why Choose DetailX
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyChooseItems.map((item) => (
              <div
                key={item.title}
                className="bg-[var(--bg)] border-l-4 border-[var(--green)] p-6 rounded-r-lg"
              >
                <span className="text-2xl mb-3 block" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="font-display text-[var(--white)] text-sm mb-2">{item.title}</h3>
                <p className="text-[var(--muted)] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission + Vision ──────────────────────────────────────────────── */}
      <section className="py-20 max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="bg-[var(--surface)] border border-[var(--border-card)] border-t-4 border-t-[var(--green)] rounded-lg p-8">
          <p className="font-display text-[var(--green)] text-xs tracking-widest mb-3">
            OUR MISSION
          </p>
          <h3 className="font-display text-[var(--white)] text-xl mb-3">Deliver Excellence</h3>
          <p className="text-[var(--muted)]">
            To provide every car owner in Kochi with access to professional-grade detailing
            services that protect their investment and restore their pride of ownership.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-[var(--surface)] border border-[var(--border-card)] border-t-4 border-t-[var(--green)] rounded-lg p-8">
          <p className="font-display text-[var(--green)] text-xs tracking-widest mb-3">
            OUR VISION
          </p>
          <h3 className="font-display text-[var(--white)] text-xl mb-3">Set the Standard</h3>
          <p className="text-[var(--muted)]">
            To be Kerala&apos;s most recognised name in automotive care, known for our quality,
            reliability, and passion for perfection.
          </p>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────────────────── */}
      <section className="bg-[var(--surface)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-[var(--white)] mb-12 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {servicesGrid.map((item) => (
              <div
                key={item.label}
                className="bg-[var(--bg)] border border-[var(--border-card)] rounded-lg p-4 text-center hover:border-[var(--green)] transition-colors duration-200"
              >
                <span className="text-3xl mb-2 block" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-sm font-display text-[var(--silver)]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
