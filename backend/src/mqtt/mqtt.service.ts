import { Injectable, OnModuleInit } from "@nestjs/common";
import * as mqtt from "mqtt";

@Injectable()
export class MqttService implements OnModuleInit {
  private client!: mqtt.MqttClient;

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

  publishFeed(feed: string, value: string) {
    if (!this.client || !this.client.connected) {
      console.log("[MQTT-PUB] Skip publish because client is not connected");
      return;
    }

    const topic = `YoloHome2907/feeds/${feed}`;
    this.client.publish(topic, value);
    console.log("[MQTT-PUB] Published:", topic, "| value =", value);
  }
}
