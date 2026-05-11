"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = require("mqtt");
let MqttService = class MqttService {
    onModuleInit() {
        this.client = mqtt.connect("mqtt://mqtt.ohstem.vn", {
            port: 1883,
            username: "YoloHome2907",
            password: "",
        });
        this.client.on("connect", () => {
            console.log("[MQTT-PUB] Connected");
        });
        this.client.on("error", (err) => {
            console.error("[MQTT-PUB] Error:", err);
        });
    }
    publishFeed(feed, value) {
        if (!this.client || !this.client.connected) {
            console.log("[MQTT-PUB] Skip publish because client is not connected");
            return;
        }
        const topic = `YoloHome2907/feeds/${feed}`;
        this.client.publish(topic, value);
        console.log("[MQTT-PUB] Published:", topic, "| value =", value);
    }
};
exports.MqttService = MqttService;
exports.MqttService = MqttService = __decorate([
    (0, common_1.Injectable)()
], MqttService);
//# sourceMappingURL=mqtt.service.js.map