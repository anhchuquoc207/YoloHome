import { Injectable, OnModuleInit } from "@nestjs/common";
import * as mqtt from "mqtt";
import { TemperatureRepository } from "../repositories/temperature.repository";

@Injectable()
export class TemperatureService implements OnModuleInit {
  constructor(private readonly repository: TemperatureRepository) {}

  getLogs() {
    return this.repository.findAll();
  }

  getCurrentReading() {
    return this.repository.findLatest();
  }

  onModuleInit() {
    const client = mqtt.connect("mqtt://mqtt.ohstem.vn", {
      port: 1883,
      username: "YoloHome2907",
      password: "",
    });

    const latest = {
      temperature: null as number | null,
      humidity: null as number | null,
      light_intensity: null as number | null,
    };

    client.on("connect", () => {
      console.log("[MQTT] Connected");

      client.subscribe("YoloHome2907/feeds/V1");
      client.subscribe("YoloHome2907/feeds/V2");
      client.subscribe("YoloHome2907/feeds/V3");
    });

    client.on("message", async (topic, payload) => {
      const value = Number(payload.toString());

      if (topic === "YoloHome2907/feeds/V1") latest.temperature = value;
      if (topic === "YoloHome2907/feeds/V2") latest.humidity = value;
      if (topic === "YoloHome2907/feeds/V3") latest.light_intensity = value;

      console.log("[MQTT] topic =", topic, "| value =", value);

      if (
        latest.temperature !== null &&
        latest.humidity !== null &&
        latest.light_intensity !== null
      ) {
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
}