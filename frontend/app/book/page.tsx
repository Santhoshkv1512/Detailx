'use client'

import React, { useReducer, useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fetchServices, fetchSlots, initiateBooking, initiatePayment } from '@/lib/api'

const ADD_ONS = [
  { id: 'tyre_polish', label: 'Tyre Polishing', price: 20000 },
  { id: 'ac_duct', label: 'AC Duct Cleaning', price: 40000 },
  { id: 'engine_bay', label: 'Engine Bay Clean', price: 60000 },
]

const CAR_MAKES = [
  'Maruti Suzuki','Hyundai','Honda','Kia','Tata','Toyota','Mahindra','MG',
  'BMW','Mercedes-Benz','Audi','Volkswagen','Skoda','Jeep','Ford','Other',
]

const COLOURS = [
  { name: 'White', hex: '#F5F5F5' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Black', hex: '#1C1C1C' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Grey', hex: '#6B7280' },
]

type Slot = { time: string; isAvailable: boolean }

type State = {
  step: number
  selectedService: any
  selectedAddOns: string[]
  selectedDate: string
  selectedTime: string
  slots: Slot[]
  slotsLoading: boolean
  carMake: string
  carModel: string
  carYear: string
  carColour: string
  carColourOther: string
  registrationNumber: string
  fuelType: string
  customerName: string
  customerPhone: string
  deliveryType: string
  pickupLine1: string
  pickupLandmark: string
  pickupPincode: string
  totalAmountPaise: number
  depositPaise: number
  balancePaise: number
  bookingId: string
  reference: string
  submitting: boolean
}

const initialState: State = {
  step: 1, selectedService: null, selectedAddOns: [],
  selectedDate: '', selectedTime: '', slots: [], slotsLoading: false,
  carMake: '', carModel: '', carYear: '2022', carColour: 'White', carColourOther: '',
  registrationNumber: '', fuelType: 'petrol', customerName: '', customerPhone: '',
  deliveryType: '', pickupLine1: '', pickupLandmark: '', pickupPincode: '',
  totalAmountPaise: 0, depositPaise: 0, balancePaise: 0,
  bookingId: '', reference: '', submitting: false,
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'SET': return { ...state, [action.key]: action.value }
    case 'NEXT': return { ...state, step: state.step + 1 }
    case 'PREV': return { ...state, step: state.step - 1 }
    case 'TOGGLE_ADDON': {
      const has = state.selectedAddOns.includes(action.id)
      const next = has ? state.selectedAddOns.filter(x => x !== action.id) : [...state.selectedAddOns, action.id]
      const base = state.selectedService?.basePrice || 0
      const addOnTotal = next.reduce((s, id) => s + (ADD_ONS.find(a => a.id === id)?.price || 0), 0)
      const total = base + addOnTotal
      const deposit = Math.max(Math.round(total * 0.2), 20000)
      return { ...state, selectedAddOns: next, totalAmountPaise: total, depositPaise: deposit, balancePaise: total - deposit }
    }
    case 'SELECT_SERVICE': {
      const base = action.service?.basePrice || 0
      const deposit = base > 0 ? Math.max(Math.round(base * 0.2), 20000) : 20000
      return { ...state, selectedService: action.service, selectedAddOns: [], totalAmountPaise: base, depositPaise: deposit, balancePaise: base - deposit }
    }
    default: return state
  }
}

function ProgressBar({ step }: { step: number }) {
  const steps = ['Service', 'Slot', 'Vehicle', 'Delivery', 'Payment']
  return (
    <div className="flex items-center justify-center mb-8 overflow-x-auto">
      {steps.map((label, i) => {
        const n = i + 1
        const done = step > n
        const current = step === n
        return (
          <React.Fragment key={n}>
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${done ? 'bg-[var(--green)] border-[var(--green)] text-black' :
                  current ? 'border-[var(--green)] text-[var(--green)] bg-transparent' :
                  'border-[var(--border-card)] text-[var(--muted)] bg-transparent'}`}>
                {done ? '✓' : n}
              </div>
              <span className={`text-[9px] mt-1 font-display tracking-wider whitespace-nowrap ${current ? 'text-[var(--green)]' : 'text-[var(--muted)]'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-8 md:w-16 mb-5 mx-1 transition-all shrink-0 ${done ? 'bg-[var(--green)]' : 'bg-[var(--border-card)]'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function inputCls(extra = '') {
  return `bg-[var(--surface)] border border-[var(--border-card)] focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] focus:outline-none text-[var(--white)] rounded-lg px-4 py-3 w-full placeholder-[var(--muted)] ${extra}`
}

function btnGreen(extra = '') {
  return `bg-[var(--green)] text-black font-display text-xs font-bold px-6 py-3 rounded-full hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${extra}`
}

function btnOutline(extra = '') {
  return `border border-[var(--border-card)] text-[var(--muted)] font-display text-xs px-6 py-3 rounded-full hover:border-[var(--silver)] hover:text-[var(--silver)] transition-all ${extra}`
}

function BookWizard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [services, setServices] = useState<any[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)

  useEffect(() => {
    fetchServices()
      .then((data: any[]) => {
        setServices(data)
        const slug = searchParams.get('service')
        if (slug) {
          const found = data.find((s: any) => s.slug === slug)
          if (found) dispatch({ type: 'SELECT_SERVICE', service: found })
        }
      })
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setServicesLoading(false))
  }, [])

  // Generate available dates (today+1 to today+30, skip Sundays)
  const availableDates = React.useMemo(() => {
    const dates: { value: string; label: string; disabled: boolean }[] = []
    const today = new Date()
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const isSunday = d.getDay() === 0
      const value = d.toISOString().split('T')[0]
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
      dates.push({ value, label, disabled: isSunday })
    }
    return dates
  }, [])

  async function onDateSelect(date: string) {
    dispatch({ type: 'SET', key: 'selectedDate', value: date })
    dispatch({ type: 'SET', key: 'selectedTime', value: '' })
    dispatch({ type: 'SET', key: 'slotsLoading', value: true })
    try {
      const data = await fetchSlots(date)
      dispatch({ type: 'SET', key: 'slots', value: data })
    } catch {
      toast.error('Failed to load slots')
    } finally {
      dispatch({ type: 'SET', key: 'slotsLoading', value: false })
    }
  }

  async function onPayNow() {
    dispatch({ type: 'SET', key: 'submitting', value: true })
    try {
      const colour = state.carColour === 'Other' ? state.carColourOther : state.carColour
      const pickupAddress = state.deliveryType === 'pickup'
        ? JSON.stringify({ line1: state.pickupLine1, landmark: state.pickupLandmark, pincode: state.pickupPincode, city: 'Kochi' })
        : undefined

      const booking = await initiateBooking({
        serviceId: state.selectedService.id,
        date: state.selectedDate,
        time: state.selectedTime,
        addOns: state.selectedAddOns,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        carMake: state.carMake,
        carModel: state.carModel,
        carYear: parseInt(state.carYear),
        carColour: colour,
        registrationNumber: state.registrationNumber.toUpperCase(),
        fuelType: state.fuelType,
        deliveryType: state.deliveryType,
        pickupAddress,
        totalAmountPaise: state.totalAmountPaise,
      })

      dispatch({ type: 'SET', key: 'bookingId', value: booking.bookingId })
      dispatch({ type: 'SET', key: 'reference', value: booking.reference })

      const payment = await initiatePayment(booking.bookingId)
      window.location.href = payment.redirectUrl
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed')
      dispatch({ type: 'SET', key: 'submitting', value: false })
    }
  }

  const s = state

  return (
    <div className="bg-[var(--bg)] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-display text-3xl text-[var(--white)] mb-1 text-center">BOOK A SERVICE</h1>
        <p className="text-[var(--muted)] text-center mb-8 text-sm">Secure your slot in under 2 minutes</p>
        <ProgressBar step={s.step} />

        <div className="bg-[var(--surface)] border border-[var(--border-card)] rounded-xl p-6 md:p-8">

          {/* STEP 1 — Service */}
          {s.step === 1 && (
            <div>
              <h2 className="font-display text-[var(--white)] text-sm mb-6">SELECT SERVICE</h2>
              {servicesLoading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-[var(--border-card)] rounded-lg animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map(svc => (
                    <div key={svc.id}
                      onClick={() => dispatch({ type: 'SELECT_SERVICE', service: svc })}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${s.selectedService?.id === svc.id ? 'border-[var(--green)] bg-[var(--green-dark)]' : 'border-[var(--border-card)] hover:border-[var(--green)]'}`}>
                      {s.selectedService?.id === svc.id && (
                        <span className="absolute top-3 right-3 bg-[var(--green)] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">✓</span>
                      )}
                      <div className="flex items-center justify-between pr-8">
                        <div>
                          <div className="font-display text-sm text-[var(--white)]">{svc.name}</div>
                          <span className="text-xs text-[var(--muted)] mt-1 inline-block">{svc.duration}</span>
                        </div>
                        <div className="font-mono text-[var(--green)] text-sm shrink-0">
                          {svc.basePrice ? `From ₹${(svc.basePrice/100).toLocaleString('en-IN')}` : 'Get Quote'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {s.selectedService && (
                <div className="mt-8">
                  <h3 className="font-display text-[var(--white)] text-xs tracking-wider mb-4">OPTIONAL ADD-ONS</h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {ADD_ONS.map(addon => (
                      <div key={addon.id}
                        onClick={() => dispatch({ type: 'TOGGLE_ADDON', id: addon.id })}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${s.selectedAddOns.includes(addon.id) ? 'border-[var(--green)] bg-[var(--green-dark)]' : 'border-[var(--border-card)] hover:border-[var(--green)]'}`}>
                        <div className="text-sm text-[var(--white)]">{addon.label}</div>
                        <div className="font-mono text-[var(--green)] text-sm mt-1">+₹{(addon.price/100).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button onClick={() => dispatch({ type: 'NEXT' })} disabled={!s.selectedService} className={btnGreen()}>
                  NEXT STEP →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Date & Slot */}
          {s.step === 2 && (
            <div>
              <h2 className="font-display text-[var(--white)] text-sm mb-6">SELECT DATE & TIME</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {availableDates.map(d => (
                  <button key={d.value} disabled={d.disabled}
                    onClick={() => onDateSelect(d.value)}
                    className={`text-xs px-3 py-2 rounded-lg border transition-all font-display
                      ${d.disabled ? 'opacity-25 cursor-not-allowed border-[var(--border-card)] text-[var(--muted)]' :
                        s.selectedDate === d.value ? 'bg-[var(--green)] text-black border-[var(--green)]' :
                        'border-[var(--border-card)] text-[var(--silver)] hover:border-[var(--green)] hover:text-[var(--green)]'}`}>
                    {d.label}
                  </button>
                ))}
              </div>

              {s.selectedDate && (
                <div>
                  <h3 className="font-display text-xs text-[var(--silver)] tracking-wider mb-3">AVAILABLE TIMES</h3>
                  {s.slotsLoading ? (
                    <div className="grid grid-cols-3 gap-3">
                      {[1,2,3,4,5,6].map(i => <div key={i} className="h-14 bg-[var(--border-card)] rounded-lg animate-pulse" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {s.slots.map(slot => (
                        <button key={slot.time} disabled={!slot.isAvailable}
                          onClick={() => dispatch({ type: 'SET', key: 'selectedTime', value: slot.time })}
                          className={`py-3 rounded-lg border text-sm transition-all
                            ${!slot.isAvailable ? 'opacity-30 cursor-not-allowed bg-[var(--surface)] text-[var(--muted)] border-[var(--border-card)]' :
                              s.selectedTime === slot.time ? 'bg-[var(--green)] text-black border-[var(--green)] font-bold' :
                              'border-[var(--border-card)] text-[var(--white)] hover:border-[var(--green)]'}`}>
                          {slot.time}
                          {!slot.isAvailable && <div className="text-[10px]">Full</div>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button onClick={() => dispatch({ type: 'PREV' })} className={btnOutline()}>← BACK</button>
                <button onClick={() => dispatch({ type: 'NEXT' })} disabled={!s.selectedDate || !s.selectedTime} className={btnGreen()}>NEXT STEP →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Vehicle */}
          {s.step === 3 && (
            <div>
              <h2 className="font-display text-[var(--white)] text-sm mb-6">VEHICLE DETAILS</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">CAR MAKE</label>
                  <select value={s.carMake} onChange={e => dispatch({ type: 'SET', key: 'carMake', value: e.target.value })} className={inputCls()}>
                    <option value="">Select make</option>
                    {CAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">CAR MODEL</label>
                  <input value={s.carModel} onChange={e => dispatch({ type: 'SET', key: 'carModel', value: e.target.value })} placeholder="e.g. Swift, Creta" className={inputCls()} />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">YEAR</label>
                  <select value={s.carYear} onChange={e => dispatch({ type: 'SET', key: 'carYear', value: e.target.value })} className={inputCls()}>
                    {Array.from({ length: 17 }, (_, i) => 2026 - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">FUEL TYPE</label>
                  <div className="flex gap-2 flex-wrap">
                    {['petrol','diesel','electric','hybrid','cng'].map(f => (
                      <button key={f} onClick={() => dispatch({ type: 'SET', key: 'fuelType', value: f })}
                        className={`font-display text-xs px-4 py-2 rounded-full border capitalize transition-all
                          ${s.fuelType === f ? 'bg-[var(--green)] text-black border-[var(--green)]' : 'border-[var(--border-card)] text-[var(--silver)] hover:border-[var(--green)]'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-[var(--muted)] mb-2 block font-display tracking-wider">COLOUR</label>
                  <div className="flex gap-3 flex-wrap items-center">
                    {COLOURS.map(c => (
                      <button key={c.name} title={c.name} onClick={() => dispatch({ type: 'SET', key: 'carColour', value: c.name })}
                        style={{ backgroundColor: c.hex }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${s.carColour === c.name ? 'border-[var(--green)] ring-2 ring-[var(--green)] scale-110' : 'border-[var(--border-card)]'}`} />
                    ))}
                    <button onClick={() => dispatch({ type: 'SET', key: 'carColour', value: 'Other' })}
                      className={`text-xs px-3 py-1 rounded-full border transition-all font-display
                        ${s.carColour === 'Other' ? 'bg-[var(--green)] text-black border-[var(--green)]' : 'border-[var(--border-card)] text-[var(--silver)]'}`}>
                      Other
                    </button>
                  </div>
                  {s.carColour === 'Other' && (
                    <input value={s.carColourOther} onChange={e => dispatch({ type: 'SET', key: 'carColourOther', value: e.target.value })}
                      placeholder="Describe colour" className={inputCls('mt-2')} />
                  )}
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">REGISTRATION NUMBER</label>
                  <input value={s.registrationNumber} onChange={e => dispatch({ type: 'SET', key: 'registrationNumber', value: e.target.value.toUpperCase() })}
                    placeholder="KL 07 AB 1234" className={`${inputCls()} font-mono uppercase`} />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">YOUR NAME</label>
                  <input value={s.customerName} onChange={e => dispatch({ type: 'SET', key: 'customerName', value: e.target.value })}
                    placeholder="Full name" className={inputCls()} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">PHONE NUMBER</label>
                  <div className="flex">
                    <span className="bg-[var(--border-card)] text-[var(--silver)] px-3 py-3 rounded-l-lg border border-[var(--border-card)] border-r-0 text-sm shrink-0">+91</span>
                    <input value={s.customerPhone} onChange={e => dispatch({ type: 'SET', key: 'customerPhone', value: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="10-digit mobile number" className="bg-[var(--surface)] border border-[var(--border-card)] border-l-0 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] focus:outline-none text-[var(--white)] rounded-r-lg px-4 py-3 w-full placeholder-[var(--muted)]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button onClick={() => dispatch({ type: 'PREV' })} className={btnOutline()}>← BACK</button>
                <button onClick={() => {
                  if (!s.carMake || !s.carModel || !s.registrationNumber || !s.customerName) return toast.error('Please fill all required fields')
                  if (s.customerPhone.length !== 10) return toast.error('Enter a valid 10-digit phone number')
                  dispatch({ type: 'NEXT' })
                }} className={btnGreen()}>NEXT STEP →</button>
              </div>
            </div>
          )}

          {/* STEP 4 — Delivery */}
          {s.step === 4 && (
            <div>
              <h2 className="font-display text-[var(--white)] text-sm mb-6">DELIVERY PREFERENCE</h2>
              <p className="text-[var(--muted)] text-sm mb-6">How will you bring your car?</p>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { value: 'dropoff', icon: '🏢', title: "I'll Drop It Off", desc: 'Drive your car to our studio in Kochi' },
                  { value: 'pickup', icon: '📍', title: 'Request Pickup', desc: "We'll collect your car from your location" },
                ].map(opt => (
                  <div key={opt.value} onClick={() => dispatch({ type: 'SET', key: 'deliveryType', value: opt.value })}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all
                      ${s.deliveryType === opt.value ? 'border-[var(--green)] bg-[var(--green-dark)]' : 'border-[var(--border-card)] hover:border-[var(--green)]'}`}>
                    {s.deliveryType === opt.value && (
                      <span className="absolute top-3 right-3 bg-[var(--green)] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">✓</span>
                    )}
                    <div className="text-4xl mb-4">{opt.icon}</div>
                    <div className="font-display text-[var(--white)] text-sm mb-2">{opt.title}</div>
                    <div className="text-[var(--muted)] text-sm">{opt.desc}</div>
                    {opt.value === 'dropoff' && (
                      <div className="mt-3 text-xs text-[var(--silver)]">
                        📍 {process.env.NEXT_PUBLIC_STUDIO_ADDRESS || 'DetailX Studio, Kochi, Kerala'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {s.deliveryType === 'pickup' && (
                <div className="mt-6 space-y-4">
                  <div className="bg-[var(--amber-bg)] border-l-4 border-[var(--amber)] rounded-r-lg p-4">
                    <p className="text-[var(--amber)] text-sm">⚠ Our team will call you to confirm your pickup time after booking.</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">ADDRESS LINE 1 *</label>
                    <input value={s.pickupLine1} onChange={e => dispatch({ type: 'SET', key: 'pickupLine1', value: e.target.value })}
                      placeholder="House no., Street, Area" className={inputCls()} />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">AREA / LANDMARK</label>
                    <input value={s.pickupLandmark} onChange={e => dispatch({ type: 'SET', key: 'pickupLandmark', value: e.target.value })}
                      placeholder="Near landmark" className={inputCls()} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">PINCODE *</label>
                      <input value={s.pickupPincode} onChange={e => dispatch({ type: 'SET', key: 'pickupPincode', value: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        placeholder="6-digit pincode" className={inputCls()} />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted)] mb-1 block font-display tracking-wider">CITY</label>
                      <input value="Kochi" disabled className="bg-[var(--border-card)] text-[var(--muted)] border border-[var(--border-card)] rounded-lg px-4 py-3 w-full cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button onClick={() => dispatch({ type: 'PREV' })} className={btnOutline()}>← BACK</button>
                <button onClick={() => {
                  if (!s.deliveryType) return toast.error('Please select a delivery option')
                  if (s.deliveryType === 'pickup' && (!s.pickupLine1 || !s.pickupPincode)) return toast.error('Please fill in the pickup address')
                  dispatch({ type: 'NEXT' })
                }} className={btnGreen()}>NEXT STEP →</button>
              </div>
            </div>
          )}

          {/* STEP 5 — Payment */}
          {s.step === 5 && (
            <div>
              <h2 className="font-display text-[var(--white)] text-sm mb-6">REVIEW & PAY</h2>

              {/* Order Summary */}
              <div className="border-l-4 border-[var(--green)] bg-[var(--bg)] rounded-r-lg p-5 mb-6 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--muted)]">Service</span><span className="text-[var(--white)]">{s.selectedService?.name}</span></div>
                {s.selectedAddOns.length > 0 && (
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Add-ons</span><span className="text-[var(--white)]">{s.selectedAddOns.map(id => ADD_ONS.find(a => a.id === id)?.label).join(', ')}</span></div>
                )}
                <div className="flex justify-between"><span className="text-[var(--muted)]">Date & Time</span><span className="text-[var(--white)]">{s.selectedDate} at {s.selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted)]">Delivery</span>
                  <span className="text-[var(--white)]">{s.deliveryType === 'pickup' ? `🏠 Pickup — ${s.pickupLine1}, ${s.pickupPincode}` : '🚗 Drop-off at studio'}</span>
                </div>
                <div className="flex justify-between"><span className="text-[var(--muted)]">Vehicle</span>
                  <span className="text-[var(--white)] text-right">{s.carMake} {s.carModel} {s.carYear} · {s.registrationNumber}</span>
                </div>
                <div className="border-t border-[var(--border-card)] pt-3 mt-3 space-y-2">
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Service Total</span><span className="font-mono text-[var(--white)]">₹{(s.totalAmountPaise/100).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--muted)]">Advance to pay now</span>
                    <span className="font-mono text-[var(--green)] text-xl font-bold">₹{(s.depositPaise/100).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Balance at studio</span><span className="font-mono text-[var(--muted)]">₹{(s.balancePaise/100).toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              {/* Payment block */}
              <div className="bg-[var(--bg)] border border-[var(--border-card)] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-bold text-purple-400 text-lg">PhonePe</span>
                  <span className="text-[var(--muted)] text-sm">Pay securely with PhonePe</span>
                </div>
                <button onClick={onPayNow} disabled={s.submitting}
                  className={`${btnGreen('w-full py-4 text-sm')} flex items-center justify-center gap-2`}>
                  {s.submitting ? (
                    <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Processing...</>
                  ) : (
                    `PAY ₹${(s.depositPaise/100).toLocaleString('en-IN')} DEPOSIT NOW`
                  )}
                </button>
                <p className="text-[var(--muted)] text-xs text-center mt-3">🔒 Secure payment · No card data stored</p>
                <p className="text-[var(--muted)] text-xs text-center mt-1">By booking you agree to our cancellation policy</p>
              </div>

              <div className="flex justify-start mt-6">
                <button onClick={() => dispatch({ type: 'PREV' })} disabled={s.submitting} className={btnOutline()}>← BACK</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BookWizard />
    </Suspense>
  )
}
