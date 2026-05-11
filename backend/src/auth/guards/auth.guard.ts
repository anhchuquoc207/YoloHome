import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { PUBLIC_ROUTE_KEY } from '../auth.constants'
import { verifyAuthToken, type AuthTokenPayload } from '../auth.utils'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const req = context.switchToHttp().getRequest<{
      headers: { authorization?: string }
      user?: AuthTokenPayload
    }>()

    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token')
    }

    const token = authHeader.slice('Bearer '.length).trim()
    const secret = this.configService.get<string>('AUTH_TOKEN_SECRET', 'yolohome-dev-secret')
    const payload = verifyAuthToken(token, secret)

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    req.user = payload
    return true
  }
}
