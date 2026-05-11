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
exports.TemperatureService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = require("mqtt");
const temperature_repository_1 = require("../repositories/temperature.repository");
let TemperatureService = class TemperatureService {
    constructor(repository) {
        this.repository = repository;
    }
    getLogs() {
        return this.repository.findAll();
    }
    getCurrentReading() {
        return this.repository.findLatest();
    }
    createLog(dto) {
        return this.repository.create({
            device_id: 2,
            temperature: dto.temperature,
            humidity: dto.humidity,
            light_intensity: dto.light_intensity ?? null,
            air_quality: dto.air_quality ?? null,
        });
    }
    onModuleInit() {
        const client = mqtt.connect("mqtt://mqtt.ohstem.vn", {
            port: 1883,
            username: "YoloHome2907",
            password: "",
        });
        const latest = {
            temperature: null,
            humidity: null,
            light_intensity: null,
        };
        client.on("connect", () => {
            console.log("[MQTT] Connected");
            client.subscribe("YoloHome2907/feeds/V1");
            client.subscribe("YoloHome2907/feeds/V2");
            client.subscribe("YoloHome2907/feeds/V3");
        });
        client.on("message", async (topic, payload) => {
            const value = Number(payload.toString());
            if (topic === "YoloHome2907/feeds/V1")
                latest.temperature = value;
            if (topic === "YoloHome2907/feeds/V2")
                latest.humidity = value;
            if (topic === "YoloHome2907/feeds/V3")
                latest.light_intensity = value;
            console.log("[MQTT] topic =", topic, "| value =", value);
            if (latest.temperature !== null &&
                latest.humidity !== null &&
                latest.light_intensity !== null) {
                await this.repository.create({
                    device_id: 2,
                    temperature: latest.temperature,
                    humidity: latest.humidity,
                    light_intensity: latest.light_intensity,
                    air_quality: null,
                });
            }
        });
        client.on("error", (err) => {
            console.error("[MQTT] Error:", err);
        });
    }
};
exports.TemperatureService = TemperatureService;
exports.TemperatureService = TemperatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [temperature_repository_1.TemperatureRepository])
], TemperatureService);
//# sourceMappingURL=temperature.service.js.map