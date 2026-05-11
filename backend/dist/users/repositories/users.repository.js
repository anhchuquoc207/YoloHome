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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const auth_utils_1 = require("../../auth/auth.utils");
const user_schema_1 = require("../schemas/user.schema");
let UsersRepository = class UsersRepository {
    constructor(model) {
        this.model = model;
    }
    async onModuleInit() {
        const count = await this.model.countDocuments();
        if (count > 0)
            return;
        await this.model.create({
            name: 'Admin',
            email: 'admin@yolohome.local',
            password_hash: (0, auth_utils_1.hashPassword)('admin12345'),
            role: 'admin',
            status: 'active',
            avatar_url: null,
            last_login_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
    }
    findAll() {
        return this.model.find().sort({ created_at: -1 });
    }
    findById(id) {
        return this.model.findById(id);
    }
    findByEmail(email) {
        return this.model.findOne({ email: email.trim().toLowerCase() });
    }
    async create(dto) {
        const normalizedEmail = dto.email.trim().toLowerCase();
        const existing = await this.model.findOne({ email: normalizedEmail });
        if (existing) {
            throw new common_1.ConflictException('Email already exists');
        }
        return this.model.create({
            name: dto.name.trim(),
            email: normalizedEmail,
            password_hash: (0, auth_utils_1.hashPassword)(dto.password),
            role: dto.role ?? 'member',
            status: 'active',
            avatar_url: null,
            last_login_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
    }
    updateLastLogin(id) {
        return this.model.findByIdAndUpdate(id, {
            $set: {
                last_login_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        }, { new: true });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map