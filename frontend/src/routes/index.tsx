import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardPage } from '../components/dashboard/DashboardPage'
import { hasStoredAuthToken } from '../lib/auth'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (!hasStoredAuthToken()) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardPage,
})
