import { createFileRoute, redirect } from '@tanstack/react-router'
import { LightsPage } from '../components/lights/LightsPage'
import { hasStoredAuthToken } from '../lib/auth'

export const Route = createFileRoute('/lights')({
  beforeLoad: () => {
    if (!hasStoredAuthToken()) {
      throw redirect({ to: '/login' })
    }
  },
  component: LightsPage,
})
