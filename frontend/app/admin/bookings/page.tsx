'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchAdminBookings, updateBookingStatus } from '@/lib/api'
import StatusBadge from '@/components/StatusBadge'
import DeliveryBadge from '@/components/DeliveryBadge'
import toast from 'react-hot-toast'

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
  })
}

function Drawer({ booking, onClose, onStatusChange }: { booking: any; onClose: () => void; onStatusChange: (id: string, status: string, notes?: string) => void }) {
  const [status, setStatus] = useState(booking.status)
  const [notes, setNotes] = useState(booking.adminNotes || '')
  const [saving, setSaving] = useState(false)

  async function saveStatus(newStatus: string) {
    setStatus(newStatus)
    setSaving(true)
    try {
      await updateBookingStatus(booking.id, newStatus, notes)
      onStatusChange(booking.id, newStatus, notes)
      toast.success('Status updated')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function saveNotes() {
    setSaving(true)
    try {
      await updateBookingStatus(booking.id, status, notes)
      toast.success('Notes saved')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const pickupAddr = booking.pickupAddress ? (() => {
    try { return JSON.parse(booking.pickupAddress) } catch { return null }
  })() : null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--surface)] border-l border-[var(--silver)] h-full overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 className="font-display text-[var(--white)] text-sm">#{booking.reference}</h2>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--white)] text-xl leading-none">×</button>
        </div>

        <div className="flex-1 p-5 space-y-5 text-sm">
          {/* Customer */}
          <section className="border-b border-[var(--border)] pb-4">
            <p className="text-[var(--white)] font-medium">{booking.customerName}</p>
            <div className="flex items-center gap-3 mt-1">
              <a href={`tel:+91${booking.customerPhone}`} className="text-[var(--green)] hover:underline">📞 +91 {booking.customerPhone}</a>
              <a href={`https://wa.me/91${booking.customerPhone}`} target="_blank" rel="noopener noreferrer"
                className="text-[10px] border border-[#25D366] text-[#25D366] px-2 py-0.5 rounded-full">WhatsApp →</a>
            </div>
          </section>

          {/* Service & slot */}
          <section className="border-b border-[var(--border)] pb-4 space-y-1">
            <Row label="Service" value={booking.service?.name} />
            <Row label="Date" value={formatDate(booking.slot?.date)} />
            <Row label="Time" value={booking.slot?.time} />
          </section>

          {/* Vehicle */}
          <section className="border-b border-[var(--border)] pb-4 space-y-1">
            <Row label="Vehicle" value={`${booking.carYear} ${booking.carMake} ${booking.carModel}`} />
            <Row label="Colour" value={booking.carColour} />
            <Row label="Reg No" value={booking.registrationNumber} mono />
            <Row label="Fuel" value={booking.fuelType} />
          </section>

          {/* Delivery */}
          <section className="border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[var(--muted)]">Delivery</span>
              <DeliveryBadge type={booking.deliveryType === 'pickup' ? 'pickup' : 'dropoff'} />
            </div>
            {pickupAddr && (
              <div className="bg-[var(--amber-bg)] border border-[var(--amber)] rounded-lg p-3 text-xs text-[var(--amber)] space-y-1">
                <p>{pickupAddr.line1}</p>
                {pickupAddr.landmark && <p>{pickupAddr.landmark}</p>}
                <p>{pickupAddr.pincode}, {pickupAddr.city}</p>
                <button onClick={() => {
                  navigator.clipboard.writeText(`${pickupAddr.line1}, ${pickupAddr.landmark || ''}, ${pickupAddr.pincode}, ${pickupAddr.city}`)
                  toast.success('Address copied')
                }} className="text-[var(--amber)] underline mt-1">Copy address</button>
              </div>
            )}
          </section>

          {/* Amounts */}
          <section className="border-b border-[var(--border)] pb-4 space-y-1">
            <Row label="Deposit Paid" value={`₹${(booking.depositPaise / 100).toLocaleString('en-IN')}`} green />
            <Row label="Balance Due" value={`₹${(booking.balancePaise / 100).toLocaleString('en-IN')}`} />
            <Row label="Payment" value={booking.paymentStatus} />
          </section>

          {/* Status update */}
          <section className="space-y-3">
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">STATUS</label>
              <select value={status} onChange={e => saveStatus(e.target.value)}
                disabled={saving}
                className="bg-[var(--bg)] border border-[var(--border-card)] focus:border-[var(--green)] focus:outline-none text-[var(--white)] rounded-lg px-3 py-2 w-full text-sm">
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">ADMIN NOTES</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={saveNotes} rows={3}
                placeholder="Internal notes..."
                className="bg-[var(--bg)] border border-[var(--border-card)] focus:border-[var(--green)] focus:outline-none text-[var(--white)] rounded-lg px-3 py-2 w-full text-sm resize-none placeholder-[var(--muted)]" />
            </div>
          </section>
        </div>

        {/* Mark complete button */}
        <div className="p-5 border-t border-[var(--border)]">
          <button onClick={() => saveStatus('completed')} disabled={status === 'completed' || saving}
            className="w-full bg-[var(--green)] text-black font-display text-xs font-bold py-3 rounded-full hover:brightness-110 transition-all disabled:opacity-40">
            MARK AS COMPLETE
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono, green }: { label: string; value: any; mono?: boolean; green?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className={`text-right ${mono ? 'font-mono text-xs' : ''} ${green ? 'text-[var(--green)] font-bold' : 'text-[var(--white)]'}`}>{value ?? '—'}</span>
    </div>
  )
}

function AdminBookingsContent() {
  const searchParams = useSearchParams()
  const [bookings, setBookings] = useState<any[]>([])
  const [meta, setMeta] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [filters, setFilters] = useState({
    date: '',
    status: searchParams.get('status') || '',
    deliveryType: searchParams.get('deliveryType') || '',
    page: '1',
  })

  const load = useCallback(() => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (filters.date) params.date = filters.date
    if (filters.status) params.status = filters.status
    if (filters.deliveryType) params.deliveryType = filters.deliveryType
    params.page = filters.page
    fetchAdminBookings(params)
      .then(data => { setBookings(data.data); setMeta(data.meta) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => { load() }, [load])

  function handleStatusChange(id: string, status: string, notes?: string) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status, adminNotes: notes } : b))
    if (selectedBooking?.id === id) setSelectedBooking((b: any) => ({ ...b, status, adminNotes: notes }))
  }

  const inputCls = "bg-[var(--surface)] border border-[var(--border-card)] focus:border-[var(--green)] focus:outline-none text-[var(--white)] rounded-lg px-3 py-2 text-sm"

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-display text-[var(--white)] text-xl tracking-wider">BOOKINGS</h1>
        <button className="border border-[var(--border-card)] text-[var(--silver)] font-display text-xs px-4 py-2 rounded-full hover:border-[var(--silver)] transition-all">
          EXPORT
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value, page: '1' }))}
          className={inputCls} />
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: '1' }))}
          className={inputCls}>
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={filters.deliveryType} onChange={e => setFilters(f => ({ ...f, deliveryType: e.target.value, page: '1' }))}
          className={inputCls}>
          <option value="">All Delivery Types</option>
          <option value="pickup">Pickup</option>
          <option value="dropoff">Drop-off</option>
        </select>
        {(filters.date || filters.status || filters.deliveryType) && (
          <button onClick={() => setFilters({ date: '', status: '', deliveryType: '', page: '1' })}
            className="text-[var(--muted)] text-sm hover:text-[var(--white)] transition-colors">Clear filters</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-[var(--muted)]">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs font-display tracking-wider">
                  <th className="text-left px-4 py-3">BOOKING ID</th>
                  <th className="text-left px-4 py-3">CUSTOMER</th>
                  <th className="text-left px-4 py-3">SERVICE</th>
                  <th className="text-left px-4 py-3">DATE & TIME</th>
                  <th className="text-left px-4 py-3">DELIVERY</th>
                  <th className="text-left px-4 py-3">STATUS</th>
                  <th className="text-left px-4 py-3">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-b border-[var(--border)] hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--green)]">{b.reference}</td>
                    <td className="px-4 py-3">
                      <div className="text-[var(--white)]">{b.customerName}</div>
                      <div className="text-[var(--muted)] text-xs">+91 {b.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--silver)]">{b.service?.name}</td>
                    <td className="px-4 py-3 text-[var(--silver)]">
                      {formatDate(b.slot?.date)}
                      <div className="text-[var(--muted)] text-xs">{b.slot?.time}</div>
                    </td>
                    <td className="px-4 py-3">
                      <DeliveryBadge type={b.deliveryType === 'pickup' ? 'pickup' : 'dropoff'} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedBooking(b)}
                        className="border border-[var(--green)] text-[var(--green)] font-display text-[10px] px-3 py-1.5 rounded-full hover:bg-[var(--green)] hover:text-black transition-all">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-[var(--muted)] text-sm">
            Page {meta.page} of {meta.totalPages} · {meta.total} bookings
          </span>
          <div className="flex gap-2">
            <button disabled={meta.page <= 1} onClick={() => setFilters(f => ({ ...f, page: String(Number(f.page) - 1) }))}
              className="border border-[var(--border-card)] text-[var(--silver)] text-xs px-3 py-1.5 rounded-full disabled:opacity-40 hover:border-[var(--silver)] transition-all">← Prev</button>
            <button disabled={meta.page >= meta.totalPages} onClick={() => setFilters(f => ({ ...f, page: String(Number(f.page) + 1) }))}
              className="border border-[var(--border-card)] text-[var(--silver)] text-xs px-3 py-1.5 rounded-full disabled:opacity-40 hover:border-[var(--silver)] transition-all">Next →</button>
          </div>
        </div>
      )}

      {/* Drawer */}
      {selectedBooking && (
        <Drawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminBookingsContent />
    </Suspense>
  )
}
