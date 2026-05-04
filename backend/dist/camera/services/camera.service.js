"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraService = void 0;
const common_1 = require("@nestjs/common");
const camera_repository_1 = require("../repositories/camera.repository");
const devices_repository_1 = require("../../devices/repositories/devices.repository");
const mqtt = require("mqtt");
let CameraService = class CameraService {
    constructor(repository, devicesRepository) {
        this.repository = repository;
        this.devicesRepository = devicesRepository;
    }
    onModuleInit() {
        this.mqttClient = mqtt.connect('mqtt://mqtt.ohstem.vn:1883', {
            username: 'YoloHome2907',
            password: '',
        });
        this.mqttClient.on('connect', () => {
            console.log('✅ Backend đã kết nối thành công với OhStem MQTT!');
        });
        this.mqttClient.on('error', (err) => {
            console.error('❌ Lỗi kết nối MQTT:', err);
        });
    }
    getLogs() {
        return this.repository.findAll();
    }
    sendCommand(dto) {
        return this.repository.createLog(dto.command);
    }
    async processRecognition(dto) {
        await this.repository.createFaceLog(dto.face_label, dto.authorized);
        if (dto.authorized === 1) {
            await this.devicesRepository.updateGateStatus('open');
            this.mqttClient.publish('YoloHome2907/feeds/V7', '1');
            console.log(`🚪 Face ID: [${dto.face_label}] -> Đã bắn lệnh 1 xuống mạch.`);
        }
        return { authorized: dto.authorized, face_label: dto.face_label };
    }
};
exports.CameraService = CameraService;
exports.CameraService = CameraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [camera_repository_1.CameraRepository,
        devices_repository_1.DevicesRepository])
], CameraService);
//# sourceMappingURL=camera.service.js.map