import { Injectable } from '@nestjs/common'
import type { CreateUserDto } from '../dto/create-user.dto'
import { UsersRepository } from '../repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  findAll() {
    return this.repository.findAll()
  }

  findById(id: string) {
    return this.repository.findById(id)
  }

  findByEmail(email: string) {
    return this.repository.findByEmail(email)
  }

  create(dto: CreateUserDto) {
    return this.repository.create(dto)
  }

  updateLastLogin(id: string) {
    return this.repository.updateLastLogin(id)
  }
}
