import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { AuthTokenPayload } from '../auth.utils'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{ user?: AuthTokenPayload }>()
    return req.user
  },
)
