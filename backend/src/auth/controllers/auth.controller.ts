import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import { CurrentUser } from '../decorators/current-user.decorator'
import { Public } from '../decorators/public.decorator'
import type { AuthTokenPayload } from '../auth.utils'
import { LoginDto } from '../dto/login.dto'
import { AuthService } from '../services/auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register account' })
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Registered')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto)
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Logged in')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  me(@CurrentUser() user: AuthTokenPayload) {
    return this.authService.me(user)
  }
}
