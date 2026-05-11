import { createFileRoute, redirect } from '@tanstack/react-router'
import { CameraPage } from '../components/camera/CameraPage'
import { hasStoredAuthToken } from '../lib/auth'

export const Route = createFileRoute('/camera')({
  beforeLoad: () => {
    if (!hasStoredAuthToken()) {
      throw redirect({ to: '/login' })
    }
  },
  component: CameraPage,
})
