import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useMatchRoute, useNavigate } from '@tanstack/react-router'
import { clearStoredAuthToken, hasStoredAuthToken } from '../lib/auth'
import { getCurrentUser } from '../services/authService'
import { getNotifications } from '../services/notificationService'
import { NotificationsPanel } from './notifications/NotificationsPanel'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/lights', label: 'Lights' },
  { to: '/temperature', label: 'Temperature' },
  { to: '/camera', label: 'Camera' },
] as const

export default function Header() {
  const matchRoute = useMatchRoute()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showNotifications, setShowNotifications] = useState(false)

  const userQuery = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentUser,
    enabled: hasStoredAuthToken(),
    retry: false,
  })

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    enabled: hasStoredAuthToken(),
    retry: false,
    refetchInterval: 5000,
  })

  const unreadCount = notificationsQuery.data?.length ?? 0

  return (
    <header className="mt-3 grid h-16 shrink-0 grid-cols-[auto_1fr_auto] items-center px-4 sm:px-8 lg:mt-5 lg:h-20 lg:px-14">
      <Link to="/" className="flex items-center gap-2.5 select-none">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C8601F] lg:h-11 lg:w-11">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 lg:text-[12px]">Smart</span>
          <span className="text-[20px] font-black leading-none tracking-tight text-stone-900 lg:text-[26px]">
            YOLO<span className="text-[#C8601F]">HOME</span>
          </span>
        </div>
      </Link>

      <nav className="hidden items-center justify-center gap-2 md:flex">
        {navItems.map((item) => {
          const isActive = item.to === '/'
            ? matchRoute({ to: '/' }) !== false
            : matchRoute({ to: item.to, fuzzy: true }) !== false

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-2xl px-4 py-2 text-base transition-all duration-150 lg:px-7 lg:py-2.5 lg:text-xl ${
                isActive
                  ? 'bg-white font-semibold text-stone-900 shadow-sm shadow-stone-200/60'
                  : 'font-medium text-stone-500 hover:text-stone-700'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-1.5 lg:gap-2">
        <div className="relative">
          <button
            onClick={() => setShowNotifications((open) => !open)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-stone-400 transition-all hover:bg-white hover:text-stone-600 lg:h-12 lg:w-12 lg:rounded-2xl"
            aria-label="Open notifications"
            aria-expanded={showNotifications}
          >
            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-[#C8601F] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {Math.min(unreadCount, 99)}
              </span>
            )}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          {showNotifications && (
            <NotificationsPanel
              notifications={notificationsQuery.data ?? []}
              isLoading={notificationsQuery.isLoading}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        <button className="hidden h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-stone-400 transition-all hover:bg-white hover:text-stone-600 md:flex lg:h-12 lg:w-12 lg:rounded-2xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        <div className="hidden items-center rounded-2xl bg-white/70 py-2 pl-3 pr-2 lg:flex">
          <div className="mr-3 min-w-0">
            <div className="truncate text-sm font-semibold text-stone-800">
              {userQuery.data?.name ?? 'Authenticated user'}
            </div>
            <div className="truncate text-xs text-stone-400">
              {userQuery.data?.email ?? 'yolohome.local'}
            </div>
          </div>
          <button
            onClick={async () => {
              clearStoredAuthToken()
              queryClient.removeQueries({ queryKey: ['authUser'] })
              await navigate({ to: '/login' })
            }}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-stone-500 transition hover:bg-white hover:text-stone-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
