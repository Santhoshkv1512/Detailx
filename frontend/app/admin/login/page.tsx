'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { accessToken } = await adminLogin(email, password)
      localStorage.setItem('dx_admin_token', accessToken)
      router.push('/admin')
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="font-display text-2xl font-black text-[var(--white)]">DETAIL</span>
            <span className="font-display text-2xl font-black text-[var(--green)]">X</span>
          </div>
          <p className="text-[var(--muted)] text-sm">Admin Portal</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl p-8">
          <h1 className="font-display text-[var(--white)] text-sm tracking-wider mb-6">SIGN IN</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">EMAIL</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@detailx.in"
                className="bg-[var(--bg)] border border-[var(--border-card)] focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] focus:outline-none text-[var(--white)] rounded-lg px-4 py-3 w-full placeholder-[var(--muted)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">PASSWORD</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="bg-[var(--bg)] border border-[var(--border-card)] focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] focus:outline-none text-[var(--white)] rounded-lg px-4 py-3 w-full placeholder-[var(--muted)]"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-[var(--green)] text-black font-display text-xs font-bold py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              style={{ boxShadow: 'var(--green-glow)' }}>
              {loading ? (
                <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Signing in...</>
              ) : 'SIGN IN'}
            </button>
          </form>
        </div>

        <p className="text-center text-[var(--muted)] text-xs mt-6">Detail X by Ajan · Admin Portal</p>
      </div>
    </div>
  )
}
