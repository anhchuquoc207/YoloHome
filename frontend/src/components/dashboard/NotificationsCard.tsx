import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '../../services/notificationService'

const TONE_STYLES = {
  info: 'bg-stone-400',
  success: 'bg-emerald-500',
  alert: 'bg-red-500',
} as const

function formatNotificationTime(date: string) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function NotificationsCard() {
  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 5000,
  })

  const items = notifications.data?.slice(0, 4) ?? []

  return (
    <div className="overflow-hidden rounded-3xl border border-black/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between bg-[#f0efed] px-7 pt-6 pb-5">
        <div>
          <div className="mb-1.5 flex items-center gap-3">
            <div className="h-4.5 w-0.75 rounded-full bg-[#C8601F]" />
            <h2 className="text-[19px] font-semibold leading-none tracking-tight text-stone-900">Notifications</h2>
          </div>
          <p className="pl-3.75 text-[13px] text-stone-400">Automatic light activity and camera events</p>
        </div>
        <div className="rounded-full bg-stone-200/80 px-3 py-1.5">
          <span className="tabular-nums text-[12px] font-semibold text-stone-500">{notifications.data?.length ?? 0} alerts</span>
        </div>
      </div>

      <div className="divide-y divide-stone-100/70">
        {notifications.isLoading && (
          <div className="px-7 py-6 text-sm text-stone-400">Loading notifications...</div>
        )}

        {!notifications.isLoading && items.length === 0 && (
          <div className="px-7 py-6 text-sm text-stone-400">No notifications yet.</div>
        )}

        {!notifications.isLoading && items.map((item) => (
          <div key={item.id} className="flex items-start gap-4 px-7 py-4">
            <div className="pt-1.5">
              <span className={`block h-2.5 w-2.5 rounded-full ${TONE_STYLES[item.tone]}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[15px] font-semibold text-stone-800">{item.title}</span>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-500">
                  {item.source}
                </span>
              </div>
              <div className="mt-1 text-[13px] leading-5 text-stone-400">{item.description}</div>
            </div>
            <div className="font-mono text-[13px] text-stone-400">
              {formatNotificationTime(item.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
