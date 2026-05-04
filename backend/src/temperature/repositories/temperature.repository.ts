import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  TemperatureLog,
  type TemperatureLogDocument,
} from "../schemas/temperature-log.schema";

@Injectable()
export class TemperatureRepository {
  constructor(
    @InjectModel(TemperatureLog.name)
    private readonly model: Model<TemperatureLogDocument>,
  ) {}

  findAll() {
    return this.model.find().sort({ created_at: -1 }).lean();
  }

  findLatest() {
    return this.model.findOne().sort({ created_at: -1 }).lean();
  }

  create(data: {
    device_id: number;
    temperature: number;
    humidity: number;
    light_intensity: number | null;
    air_quality: number | null;
  }) {
    return this.model.create({
      ...data,
      created_at: new Date().toISOString(),
    });
  }
}