import { apiClient } from '../lib/apiClient'
import type { Device, CameraLog } from '../types'

export async function getCamera(): Promise<Device | undefined> {
  const arr = await apiClient.get<Device[]>('/devices?type=camera')
  return arr[0]
}

export async function getGate(): Promise<Device | undefined> {
  const arr = await apiClient.get<Device[]>('/devices?type=gate')
  return arr[0]
}

export function getCameraLogs(): Promise<CameraLog[]> {
  return apiClient.get<CameraLog[]>('/camera/logs')
}

export function sendCameraCommand(command: 'on' | 'off'): Promise<void> {
  return apiClient.post<void>('/camera/commands', { command })
}

export function sendRecognition(
  authorized: 0 | 1,
  label: string
): Promise<{ authorized: 0 | 1; face_label: string }> {
  return apiClient.post<{ authorized: 0 | 1; face_label: string }>(
    '/camera/recognize',
    {
      device_id: 1,
      face_label: label,
      authorized,
    }
  )
}
