import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'admin@yolohome.local' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'admin12345' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string
}
