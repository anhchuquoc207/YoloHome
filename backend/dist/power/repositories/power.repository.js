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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const light_command_schema_1 = require("../../lights/schemas/light-command.schema");
const LIGHT_POWER_KW = 0.012;
const BAR_COUNT = 20;
let PowerRepository = class PowerRepository {
    constructor(lightCommandModel) {
        this.lightCommandModel = lightCommandModel;
    }
    async getHistory() {
        const commands = await this.lightCommandModel
            .find()
            .sort({ created_at: 1 })
            .lean();
        const now = new Date();
        if (commands.length === 0) {
            return {
                bars: [],
                total_kwh: 0,
                trend: '+0%',
                time_start: '--:--',
                time_end: now.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };
        }
        const start = new Date(commands[0].created_at);
        if (Number.isNaN(start.getTime())) {
            return {
                bars: [],
                total_kwh: 0,
                trend: '+0%',
                time_start: '--:--',
                time_end: now.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };
        }
        const startMs = start.getTime();
        const endMs = now.getTime();
        const totalRangeMs = Math.max(endMs - startMs, 1);
        const barDurationMs = totalRangeMs / BAR_COUNT;
        const bars = Array.from({ length: BAR_COUNT }, (_, index) => {
            const barStartMs = startMs + index * barDurationMs;
            return {
                time: new Date(barStartMs).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                value: 0,
            };
        });
        const lightOnTime = new Map();
        const addConsumption = (from, to) => {
            const fromMs = from.getTime();
            const toMs = to.getTime();
            if (Number.isNaN(fromMs) || Number.isNaN(toMs) || toMs <= fromMs) {
                return;
            }
            for (let i = 0; i < BAR_COUNT; i++) {
                const barStartMs = startMs + i * barDurationMs;
                const barEndMs = startMs + (i + 1) * barDurationMs;
                const overlapStartMs = Math.max(fromMs, barStartMs);
                const overlapEndMs = Math.min(toMs, barEndMs);
                if (overlapEndMs <= overlapStartMs) {
                    continue;
                }
                const durationHours = (overlapEndMs - overlapStartMs) / 1000 / 60 / 60;
                bars[i].value += LIGHT_POWER_KW * durationHours;
            }
        };
        for (const command of commands) {
            const deviceId = command.device_id;
            const commandTime = new Date(command.created_at);
            if (Number.isNaN(commandTime.getTime())) {
                continue;
            }
            if (command.command === 'on') {
                lightOnTime.set(deviceId, commandTime);
            }
            if (command.command === 'off') {
                const startTime = lightOnTime.get(deviceId);
                if (!startTime) {
                    continue;
                }
                addConsumption(startTime, commandTime);
                lightOnTime.delete(deviceId);
            }
        }
        for (const startTime of lightOnTime.values()) {
            addConsumption(startTime, now);
        }
        const normalizedBars = bars.map((bar) => Number(bar.value.toFixed(4)));
        const totalKwh = normalizedBars.reduce((sum, value) => sum + value, 0);
        return {
            bars: normalizedBars,
            total_kwh: Number(totalKwh.toFixed(4)),
            trend: '+0%',
            time_start: start.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            time_end: now.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
    }
};
exports.PowerRepository = PowerRepository;
exports.PowerRepository = PowerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(light_command_schema_1.LightCommand.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PowerRepository);
//# sourceMappingURL=power.repository.js.map