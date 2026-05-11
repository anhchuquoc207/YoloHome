import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/guards/auth.guard";
import { HealthModule } from "./health/health.module";
import { DevicesModule } from "./devices/devices.module";
import { LightsModule } from "./lights/lights.module";
import { TemperatureModule } from "./temperature/temperature.module";
import { CameraModule } from "./camera/camera.module";
import { PowerModule } from "./power/power.module";
import { MqttModule } from "./mqtt/mqtt.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    HealthModule,
    DevicesModule,
    LightsModule,
    TemperatureModule,
    CameraModule,
    PowerModule,
    MqttModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
