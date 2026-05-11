import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type { PowerHistory } from '../interfaces/power-history.interface'
import {
  LightCommand,
  LightCommandDocument,
} from '../../lights/schemas/light-command.schema'

const LIGHT_POWER_KW = 0.012 // 12W = 0.012kW
const BAR_COUNT = 20

@Injectable()
export class PowerRepository {
  constructor(
    @InjectModel(LightCommand.name)
    private readonly lightCommandModel: Model<LightCommandDocument>,
  ) {}

  async getHistory(): Promise<PowerHistory> {
    const commands = await this.lightCommandModel
      .find()
      .sort({ created_at: 1 })
      .lean()

    const now = new Date()

    if (commands.length === 0) {
      return {
        bars: [],
        total_kwh: 0,
        trend: '+0%',
        time_start: '--:--',
        time_end: now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
    }

    const start = new Date(commands[0].created_at)

    if (Number.isNaN(start.getTime())) {
      return {
        bars: [],
        total_kwh: 0,
        trend: '+0%',
        time_start: '--:--',
        time_end: now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
    }

    const startMs = start.getTime()
    const endMs = now.getTime()
    const totalRangeMs = Math.max(endMs - startMs, 1)
    const barDurationMs = totalRangeMs / BAR_COUNT

    const bars = Array.from({ length: BAR_COUNT }, (_, index) => {
      const barStartMs = startMs + index * barDurationMs

      return {
        time: new Date(barStartMs).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        value: 0,
      }
    })

    const lightOnTime = new Map<number, Date>()

    const addConsumption = (from: Date, to: Date) => {
      const fromMs = from.getTime()
      const toMs = to.getTime()

      if (Number.isNaN(fromMs) || Number.isNaN(toMs) || toMs <= fromMs) {
        return
      }

      for (let i = 0; i < BAR_COUNT; i++) {
        const barStartMs = startMs + i * barDurationMs
        const barEndMs = startMs + (i + 1) * barDurationMs

        const overlapStartMs = Math.max(fromMs, barStartMs)
        const overlapEndMs = Math.min(toMs, barEndMs)

        if (overlapEndMs <= overlapStartMs) {
          continue
        }

        const durationHours = (overlapEndMs - overlapStartMs) / 1000 / 60 / 60
        bars[i].value += LIGHT_POWER_KW * durationHours
      }
    }

    for (const command of commands) {
      const deviceId = command.device_id
      const commandTime = new Date(command.created_at)

      if (Number.isNaN(commandTime.getTime())) {
        continue
      }

      if (command.command === 'on') {
        lightOnTime.set(deviceId, commandTime)
      }

      if (command.command === 'off') {
        const startTime = lightOnTime.get(deviceId)

        if (!startTime) {
          continue
        }

        addConsumption(startTime, commandTime)
        lightOnTime.delete(deviceId)
      }
    }

    // Nếu đèn vẫn đang bật, tính từ lúc bật tới hiện tại
    for (const startTime of lightOnTime.values()) {
      addConsumption(startTime, now)
    }

const normalizedBars = bars.map((bar) => Number(bar.value.toFixed(4)))

const totalKwh = normalizedBars.reduce((sum, value) => sum + value, 0)

return {
  bars: normalizedBars,
  total_kwh: Number(totalKwh.toFixed(4)),
  trend: '+0%',
  time_start: start.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }),
  time_end: now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }),
}
}
}