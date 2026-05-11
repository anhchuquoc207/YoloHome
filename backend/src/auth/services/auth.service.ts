import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { CreateUserDto } from '../../users/dto/create-user.dto'
import { UsersService } from '../../users/services/users.service'
import type { LoginDto } from '../dto/login.dto'
import { signAuthToken, verifyPassword, type AuthTokenPayload } from '../auth.utils'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto)
    return this.buildAuthResponse(user.id, user.name, user.email, user.role)
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user || !verifyPassword(dto.password, user.password_hash)) {
      throw new UnauthorizedException('Invalid email or password')
    }

    if (user.status !== 'active') {
      throw new ForbiddenException('User is disabled')
    }

    await this.usersService.updateLastLogin(user.id)
    return this.buildAuthResponse(user.id, user.name, user.email, user.role)
  }

  me(user: AuthTokenPayload) {
    return this.usersService.findById(user.sub)
  }

  private buildAuthResponse(id: string, name: string, email: string, role: string) {
    const secret = this.configService.get<string>('AUTH_TOKEN_SECRET', 'yolohome-dev-secret')
    const ttlSeconds = this.configService.get<number>('AUTH_TOKEN_TTL_SECONDS', 86400)
    const token = signAuthToken({ sub: id, email, role }, secret, ttlSeconds)

    return {
      token,
      user: {
        id,
        name,
        email,
        role,
      },
    }
  }
}
