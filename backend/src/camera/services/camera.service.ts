import { Injectable, OnModuleInit } from '@nestjs/common'
import { CameraRepository } from '../repositories/camera.repository'
import { DevicesRepository } from '../../devices/repositories/devices.repository'
import type { CameraCommandDto } from '../dto/camera-command.dto'
import type { CameraRecognizeDto } from '../dto/camera-recognize.dto'
import * as mqtt from 'mqtt'

@Injectable()
export class CameraService implements OnModuleInit {
  private mqttClient!: mqtt.MqttClient

  constructor(
    private readonly repository: CameraRepository,
    private readonly devicesRepository: DevicesRepository,
  ) {}

  onModuleInit() {
    this.mqttClient = mqtt.connect('mqtt://mqtt.ohstem.vn:1883', {
      username: 'YoloHome2907',
      password: '',
    })

    this.mqttClient.on('connect', () => {
      console.log('✅ Backend đã kết nối thành công với OhStem MQTT!')
      
      this.mqttClient.subscribe('YoloHome2907/feeds/V7', (err) => {
        if (!err) console.log('🎧 Đang lắng nghe trạng thái cửa trên kênh V7')
      })
    })

    this.mqttClient.on('message', async (topic, message) => {
      if (topic === 'YoloHome2907/feeds/V7') {
        const payload = message.toString()
        
        if (payload === '0') {
          console.log('🔄 Mạch Yolo:Bit báo cửa đã đóng. Cập nhật lại UI...')
          await this.devicesRepository.updateGateStatus('closed')
        }
      }
    })

    this.mqttClient.on('error', (err) => {
      console.error('❌ Lỗi kết nối MQTT:', err)
    })
  }

  getLogs() {
    return this.repository.findAll()
  }

  sendCommand(dto: CameraCommandDto) {
    return this.repository.createLog(dto.command)
  }

  async processRecognition(dto: CameraRecognizeDto) {
    await this.repository.createFaceLog(dto.face_label, dto.authorized)

    if (dto.authorized === 1) {
      await this.devicesRepository.updateGateStatus('open')
      
      this.mqttClient.publish('YoloHome2907/feeds/V7', '1')
      console.log(`🚪 Face ID: [${dto.face_label}] -> Đã bắn lệnh 1 xuống mạch.`)
    }

    return { authorized: dto.authorized, face_label: dto.face_label }
  }
}