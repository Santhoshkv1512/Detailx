const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('dx_admin_token')
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

// ─── Public ────────────────────────────────────────────────────────────────

export async function fetchServices() {
  const res = await fetch(`${API_URL}/api/services`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch services')
  return res.json()
}

export async function fetchService(slug: string) {
  const res = await fetch(`${API_URL}/api/services/${slug}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Failed to fetch service: ${slug}`)
  return res.json()
}

export async function fetchWashPricing(vehicle?: string) {
  const url = vehicle
    ? `${API_URL}/api/pricing/wash?vehicle=${encodeURIComponent(vehicle)}`
    : `${API_URL}/api/pricing/wash`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch wash pricing')
  return res.json()
}

export async function fetchSlots(date: string) {
  const res = await fetch(`${API_URL}/api/slots?date=${encodeURIComponent(date)}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch slots')
  return res.json()
}

export async function initiateBooking(data: any) {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to create booking')
  }
  return res.json()
}

export async function initiatePayment(bookingId: string) {
  const res = await fetch(`${API_URL}/api/payments/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to initiate payment')
  }
  return res.json()
}

export async function getBookingStatus(reference: string) {
  const res = await fetch(`${API_URL}/api/bookings/status/${encodeURIComponent(reference)}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch booking status')
  return res.json()
}

// ─── Admin ─────────────────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Login failed')
  }
  return res.json()
}

export async function fetchAdminBookings(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await fetch(`${API_URL}/api/admin/bookings${qs}`, {
    headers: authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch bookings')
  return res.json()
}

export async function fetchAdminBooking(id: string) {
  const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
    headers: authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch booking')
  return res.json()
}

export async function updateBookingStatus(id: string, status: string, notes?: string) {
  const res = await fetch(`${API_URL}/api/admin/bookings/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status, notes }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to update booking status')
  }
  return res.json()
}

export async function fetchTodayStats() {
  const res = await fetch(`${API_URL}/api/admin/stats/today`, {
    headers: authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}
