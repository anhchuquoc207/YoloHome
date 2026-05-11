import { OnModuleInit } from "@nestjs/common";
import { TemperatureRepository } from "../repositories/temperature.repository";
export declare class TemperatureService implements OnModuleInit {
    private readonly repository;
    constructor(repository: TemperatureRepository);
    getLogs(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "find", {}>;
    getCurrentReading(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "findOne", {}>;
    createLog(dto: {
        temperature: number;
        humidity: number;
        light_intensity?: number | null;
        air_quality?: number | null;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/temperature-log.schema").TemperatureLog, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/temperature-log.schema").TemperatureLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    onModuleInit(): void;
}
