import { getLightCommands } from './lightService'
import { getCameraLogs } from './cameraService'
import type { CameraLog } from '../types'

export interface AppNotification {
  id: string
  source: 'light' | 'camera'
  title: string
  description: string
  created_at: string
  tone: 'info' | 'success' | 'alert'
}

export async function getNotifications(): Promise<AppNotification[]> {
  const [lightCommands, cameraLogs] = await Promise.all([
    getLightCommands(),
    getCameraLogs(),
  ])

  const lightNotifications: AppNotification[] = lightCommands
    .filter((command) => command.command === 'off' && command.trigger === 'auto')
    .map((command) => {
      const roomName = command.device_name ?? command.device?.name ?? 'Light'

      return {
        id: `light-${command.id}`,
        source: 'light',
        title: 'Auto off executed',
        description: `${roomName} was turned off automatically.`,
        created_at: command.created_at,
        tone: 'info',
      }
    })

  const cameraNotifications = buildCameraNotifications(cameraLogs)

  return [...lightNotifications, ...cameraNotifications]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

function buildCameraNotifications(logs: CameraLog[]): AppNotification[] {
  const deniedByLabel = new Map<string, number>()

  return [...logs]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .flatMap((log) => {
      if (log.event !== 'face_detected') return []

      const faceName = log.face_label?.trim() || 'Unknown'

      if (log.authorized === 1) {
        return [{
          id: `camera-accepted-${log.id}`,
          source: 'camera' as const,
          title: 'Camera access accepted',
          description: `${faceName} was accepted by the camera.`,
          created_at: log.created_at,
          tone: 'success' as const,
        }]
      }

      const nextCount = (deniedByLabel.get(faceName) ?? 0) + 1
      deniedByLabel.set(faceName, nextCount)

      if (nextCount <= 3) return []

      return [{
        id: `camera-denied-${log.id}`,
        source: 'camera' as const,
        title: 'Repeated access denied',
        description: `${faceName} has been denied ${nextCount} times by the camera.`,
        created_at: log.created_at,
        tone: 'alert' as const,
      }]
    })
}
