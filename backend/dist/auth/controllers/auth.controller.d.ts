import { CreateUserDto } from '../../users/dto/create-user.dto';
import type { AuthTokenPayload } from '../auth.utils';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: CreateUserDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    me(user: AuthTokenPayload): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../users/schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../users/schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../users/schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../users/schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("../../users/schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "findOne", {}>;
}
