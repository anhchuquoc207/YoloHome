import { Injectable } from "@nestjs/common";
import { LightsRepository } from "../repositories/lights.repository";
import type { CreateCommandDto } from "../dto/create-command.dto";
import type { RoomCommandDto } from "../dto/room-command.dto";
import type { UpdateRoomSettingsDto } from "../dto/update-room-settings.dto";
import { MqttService } from "../../mqtt/mqtt.service";

@Injectable()
export class LightsService {
  constructor(
    private readonly repository: LightsRepository,
    private readonly mqttService: MqttService,
  ) {}

  getCommands() {
    return this.repository.findAll();
  }

  sendCommand(dto: CreateCommandDto) {
    const result = this.repository.create(dto.command);

    if (dto.command === "on") {
      this.mqttService.publishFeed("V18", "1");
    } else if (dto.command === "off") {
      this.mqttService.publishFeed("V18", "0");
    }

    return result;
  }

  getRoomSettings() {
    return this.repository.getRoomSettings();
  }

  sendRoomCommand(room: string, dto: RoomCommandDto) {
    const result = this.repository.sendRoomCommand(room, dto.command);

    const roomName = room.toLowerCase();
    let feed = "";

    if (roomName.includes("living")) {
      feed = "V18";
    } else if (roomName.includes("bed")) {
      feed = "V19";
    } else if (roomName.includes("kitchen")) {
      feed = "V20";
    }

    if (feed) {
      if (dto.command === "on") {
        this.mqttService.publishFeed(feed, "1");
      } else if (dto.command === "off") {
        this.mqttService.publishFeed(feed, "0");
      }
    }

    return result;
  }

  updateRoomSettings(room: string, dto: UpdateRoomSettingsDto) {
    return this.repository.updateRoomSettings(room, dto);
  }
}
