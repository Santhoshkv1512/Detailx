/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_STUDIO_PHONE: process.env.NEXT_PUBLIC_STUDIO_PHONE || '+91 98765 43210',
    NEXT_PUBLIC_STUDIO_WHATSAPP: process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || '919876543210',
    NEXT_PUBLIC_STUDIO_ADDRESS: process.env.NEXT_PUBLIC_STUDIO_ADDRESS || 'DetailX Studio, Kochi, Kerala',
  },
}
module.exports = nextConfig
