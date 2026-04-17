import type { Metadata } from 'next'
import { Orbitron, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Detail X by Ajan | Premium Car Detailing Kochi',
  description:
    'Kochi\'s premium car detailing studio. Expert ceramic coating, paint protection film, and complete car care services delivered with precision by Detail X by Ajan.',
  keywords: ['car detailing kochi', 'ceramic coating kochi', 'paint protection kochi', 'detail x ajan'],
  openGraph: {
    title: 'Detail X by Ajan | Premium Car Detailing Kochi',
    description: 'Kochi\'s premium car detailing studio. Ceramic coating, paint protection, and complete car care.',
    type: 'website',
  },
}

const STUDIO_WHATSAPP = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || '919876543210'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[var(--bg)] text-[var(--white)] font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />

        {/* Floating WhatsApp Button */}
        <a
          href={`https://wa.me/${STUDIO_WHATSAPP}?text=Hi%20DetailX%2C%20I%20want%20to%20book%20a%20car%20detailing%20service.`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] wa-pulse shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="Chat on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-7 h-7"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#F5F5F5',
              border: '1px solid #2A2A2A',
            },
            success: {
              iconTheme: {
                primary: '#2DB56A',
                secondary: '#111111',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
