import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PowerController } from './controllers/power.controller'
import { PowerService } from './services/power.service'
import { PowerRepository } from './repositories/power.repository'
import {
  LightCommand,
  LightCommandSchema,
} from '../lights/schemas/light-command.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LightCommand.name, schema: LightCommandSchema },
    ]),
  ],
  controllers: [PowerController],
  providers: [PowerService, PowerRepository],
})
export class PowerModule {}