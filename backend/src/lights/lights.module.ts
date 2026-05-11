import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LightsController } from "./controllers/lights.controller";
import { LightsService } from "./services/lights.service";
import { LightsRepository } from "./repositories/lights.repository";
import {
  LightCommand,
  LightCommandSchema,
} from "./schemas/light-command.schema";
import { RoomSetting, RoomSettingSchema } from "./schemas/room-setting.schema";
import { MqttModule } from "../mqtt/mqtt.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LightCommand.name, schema: LightCommandSchema },
      { name: RoomSetting.name, schema: RoomSettingSchema },
    ]),
    MqttModule,
  ],
  controllers: [LightsController],
  providers: [LightsService, LightsRepository],
})
export class LightsModule {}
