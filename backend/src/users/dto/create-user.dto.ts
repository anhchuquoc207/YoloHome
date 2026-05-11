import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'Kim Nguyen' })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name!: string

  @ApiProperty({ example: 'kim@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: '12345678', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string

  @ApiPropertyOptional({ enum: ['admin', 'member', 'viewer'], example: 'member' })
  @IsOptional()
  @IsEnum(['admin', 'member', 'viewer'])
  role?: 'admin' | 'member' | 'viewer'
}
