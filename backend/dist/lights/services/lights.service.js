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
exports.LightsService = void 0;
const common_1 = require("@nestjs/common");
const lights_repository_1 = require("../repositories/lights.repository");
const mqtt_service_1 = require("../../mqtt/mqtt.service");
let LightsService = class LightsService {
    constructor(repository, mqttService) {
        this.repository = repository;
        this.mqttService = mqttService;
    }
    getCommands() {
        return this.repository.findAll();
    }
    sendCommand(dto) {
        const result = this.repository.create(dto.command);
        if (dto.command === "on") {
            this.mqttService.publishFeed("V18", "1");
        }
        else if (dto.command === "off") {
            this.mqttService.publishFeed("V18", "0");
        }
        return result;
    }
    getRoomSettings() {
        return this.repository.getRoomSettings();
    }
    sendRoomCommand(room, dto) {
        const result = this.repository.sendRoomCommand(room, dto.command);
        const roomName = room.toLowerCase();
        let feed = "";
        if (roomName.includes("living")) {
            feed = "V18";
        }
        else if (roomName.includes("bed")) {
            feed = "V19";
        }
        else if (roomName.includes("kitchen")) {
            feed = "V20";
        }
        if (feed) {
            if (dto.command === "on") {
                this.mqttService.publishFeed(feed, "1");
            }
            else if (dto.command === "off") {
                this.mqttService.publishFeed(feed, "0");
            }
        }
        return result;
    }
    updateRoomSettings(room, dto) {
        return this.repository.updateRoomSettings(room, dto);
    }
};
exports.LightsService = LightsService;
exports.LightsService = LightsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [lights_repository_1.LightsRepository,
        mqtt_service_1.MqttService])
], LightsService);
//# sourceMappingURL=lights.service.js.map