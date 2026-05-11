import type { AppNotification } from '../../services/notificationService'

type NotificationsPanelProps = {
  notifications: AppNotification[]
  isLoading?: boolean
  onClose: () => void
}

const TONE_STYLES = {
  info: {
    dot: 'bg-stone-400',
    chip: 'bg-stone-100 text-stone-500',
  },
  success: {
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-600',
  },
  alert: {
    dot: 'bg-red-500',
    chip: 'bg-red-50 text-red-500',
  },
} as const

function formatNotificationTime(date: string) {
  const value = new Date(date)

  return {
    time: value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    date: value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }
}

export function NotificationsPanel({ notifications, isLoading, onClose }: NotificationsPanelProps) {
  const latestNotifications = notifications.slice(0, 8)

  return (
    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(92vw,25rem)] overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_18px_60px_rgba(28,25,23,0.18)]">
      <div className="flex items-start justify-between border-b border-stone-100 bg-[#f3f1ea] px-5 py-4">
        <div>
          <div className="text-[18px] font-semibold tracking-tight text-stone-900">Notifications</div>
          <div className="mt-1 text-[12px] text-stone-400">Light activity and camera events</div>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl px-2 py-1 text-xs font-semibold text-stone-400 transition hover:bg-white hover:text-stone-700"
        >
          Close
        </button>
      </div>

      <div className="max-h-[26rem] overflow-auto">
        {isLoading && (
          <div className="px-5 py-6 text-sm text-stone-400">Loading notifications...</div>
        )}

        {!isLoading && latestNotifications.length === 0 && (
          <div className="px-5 py-6 text-sm text-stone-400">No notifications yet.</div>
        )}

        {!isLoading && latestNotifications.map((notification) => {
          const meta = formatNotificationTime(notification.created_at)
          const tone = TONE_STYLES[notification.tone]

          return (
            <div key={notification.id} className="flex gap-3 border-b border-stone-100/80 px-5 py-4 last:border-b-0">
              <div className="flex pt-1.5">
                <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${tone.dot}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-stone-800">{notification.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${tone.chip}`}>
                    {notification.source}
                  </span>
                </div>
                <div className="mt-1 text-[13px] leading-5 text-stone-500">{notification.description}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-[12px] text-stone-400">{meta.time}</div>
                <div className="mt-1 text-[11px] text-stone-300">{meta.date}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
