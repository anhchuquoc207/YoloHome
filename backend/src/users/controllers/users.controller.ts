import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { AuthTokenPayload } from '../../auth/auth.utils'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import { CreateUserDto } from '../dto/create-user.dto'
import { UsersService } from '../services/users.service'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current authenticated user' })
  @Get('me')
  me(@CurrentUser() user: AuthTokenPayload) {
    return this.usersService.findById(user.sub)
  }

  @ApiOperation({ summary: 'Create a new user account' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('User created')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }
}
