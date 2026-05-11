import { createFileRoute, redirect } from '@tanstack/react-router'
import { TemperaturePage } from '../components/temperature/TemperaturePage'
import { hasStoredAuthToken } from '../lib/auth'

export const Route = createFileRoute('/temperature')({
  beforeLoad: () => {
    if (!hasStoredAuthToken()) {
      throw redirect({ to: '/login' })
    }
  },
  component: TemperaturePage,
})
