export default function DeliveryBadge({ type }: { type: 'pickup' | 'dropoff' }) {
  if (type === 'pickup') {
    return (
      <span className="inline-flex items-center bg-[var(--amber)] text-black text-xs font-bold px-2 py-1 rounded-full">
        Pickup
      </span>
    )
  }

  return (
    <span className="inline-flex items-center bg-[var(--border-card)] text-[var(--silver)] text-xs px-2 py-1 rounded-full">
      Drop-off
    </span>
  )
}
