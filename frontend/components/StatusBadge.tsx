type Status = 'confirmed' | 'pending' | 'in_progress' | 'completed' | 'cancelled'

const statusConfig: Record<Status, { label: string; className: string }> = {
  confirmed: {
    label: 'Confirmed',
    className: 'bg-[var(--green)] text-black',
  },
  pending: {
    label: 'Pending',
    className: 'border border-[var(--amber)] text-[var(--amber)]',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-[var(--blue)] text-white',
  },
  completed: {
    label: 'Completed',
    className: 'bg-[#374151] text-white',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-900 text-red-300',
  },
}

export default function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border-card)]',
  }

  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
