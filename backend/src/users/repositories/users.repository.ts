import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { hashPassword } from '../../auth/auth.utils'
import type { CreateUserDto } from '../dto/create-user.dto'
import { User, type UserDocument } from '../schemas/user.schema'

@Injectable()
export class UsersRepository implements OnModuleInit {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

  async onModuleInit() {
    const count = await this.model.countDocuments()
    if (count > 0) return

    await this.model.create({
      name: 'Admin',
      email: 'admin@yolohome.local',
      password_hash: hashPassword('admin12345'),
      role: 'admin',
      status: 'active',
      avatar_url: null,
      last_login_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  findAll() {
    return this.model.find().sort({ created_at: -1 })
  }

  findById(id: string) {
    return this.model.findById(id)
  }

  findByEmail(email: string) {
    return this.model.findOne({ email: email.trim().toLowerCase() })
  }

  async create(dto: CreateUserDto) {
    const normalizedEmail = dto.email.trim().toLowerCase()
    const existing = await this.model.findOne({ email: normalizedEmail })
    if (existing) {
      throw new ConflictException('Email already exists')
    }

    return this.model.create({
      name: dto.name.trim(),
      email: normalizedEmail,
      password_hash: hashPassword(dto.password),
      role: dto.role ?? 'member',
      status: 'active',
      avatar_url: null,
      last_login_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  updateLastLogin(id: string) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      { new: true },
    )
  }
}
