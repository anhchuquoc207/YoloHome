import { PowerService } from '../services/power.service';
export declare class PowerController {
    private readonly powerService;
    constructor(powerService: PowerService);
    getHistory(): Promise<import("../interfaces/power-history.interface").PowerHistory>;
}
