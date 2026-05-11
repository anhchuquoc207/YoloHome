import { Model } from 'mongoose';
import type { PowerHistory } from '../interfaces/power-history.interface';
import { LightCommandDocument } from '../../lights/schemas/light-command.schema';
export declare class PowerRepository {
    private readonly lightCommandModel;
    constructor(lightCommandModel: Model<LightCommandDocument>);
    getHistory(): Promise<PowerHistory>;
}
