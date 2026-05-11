import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '../components/auth/LoginPage'
import { hasStoredAuthToken } from '../lib/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (hasStoredAuthToken()) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})
