'use client'

import { useEffect, useState } from 'react'
import { fetchTodayStats } from '@/lib/api'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: "Today's Bookings", key: 'totalToday', color: 'text-[var(--white)]', border: '' },
    { label: 'Pickup Requests', key: 'pickupRequests', color: 'text-[var(--amber)]', border: 'border-b-2 border-[var(--amber)]' },
    { label: 'In Progress', key: 'inProgress', color: 'text-[var(--blue)]', border: 'border-b-2 border-[var(--blue)]' },
    { label: 'Completed Today', key: 'completedToday', color: 'text-[var(--green)]', border: 'border-b-2 border-[var(--green)]' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-[var(--white)] text-xl tracking-wider">DASHBOARD</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.key} className={`bg-[var(--surface)] border border-[var(--border-card)] rounded-xl p-5 ${card.border}`}>
            {loading ? (
              <div className="h-8 w-12 bg-[var(--border-card)] rounded animate-pulse mb-2" />
            ) : (
              <div className={`font-display text-3xl font-black ${card.color}`}>{stats?.[card.key] ?? 0}</div>
            )}
            <div className="text-[var(--muted)] text-xs mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl p-6">
        <h2 className="font-display text-[var(--silver)] text-xs tracking-widest mb-4">QUICK ACTIONS</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/bookings" className="bg-[var(--green)] text-black font-display text-xs px-5 py-2.5 rounded-full hover:brightness-110 transition-all">
            VIEW ALL BOOKINGS
          </Link>
          <Link href="/admin/bookings?deliveryType=pickup" className="border border-[var(--amber)] text-[var(--amber)] font-display text-xs px-5 py-2.5 rounded-full hover:bg-[var(--amber)] hover:text-black transition-all">
            PICKUP REQUESTS
          </Link>
          <Link href="/admin/bookings?status=in_progress" className="border border-[var(--blue)] text-[var(--blue)] font-display text-xs px-5 py-2.5 rounded-full hover:bg-[var(--blue)] hover:text-white transition-all">
            IN PROGRESS
          </Link>
        </div>
      </div>
    </div>
  )
}
