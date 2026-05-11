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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../../users/services/users.service");
const auth_utils_1 = require("../auth.utils");
let AuthService = class AuthService {
    constructor(usersService, configService) {
        this.usersService = usersService;
        this.configService = configService;
    }
    async register(dto) {
        const user = await this.usersService.create(dto);
        return this.buildAuthResponse(user.id, user.name, user.email, user.role);
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !(0, auth_utils_1.verifyPassword)(dto.password, user.password_hash)) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.status !== 'active') {
            throw new common_1.ForbiddenException('User is disabled');
        }
        await this.usersService.updateLastLogin(user.id);
        return this.buildAuthResponse(user.id, user.name, user.email, user.role);
    }
    me(user) {
        return this.usersService.findById(user.sub);
    }
    buildAuthResponse(id, name, email, role) {
        const secret = this.configService.get('AUTH_TOKEN_SECRET', 'yolohome-dev-secret');
        const ttlSeconds = this.configService.get('AUTH_TOKEN_TTL_SECONDS', 86400);
        const token = (0, auth_utils_1.signAuthToken)({ sub: id, email, role }, secret, ttlSeconds);
        return {
            token,
            user: {
                id,
                name,
                email,
                role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map