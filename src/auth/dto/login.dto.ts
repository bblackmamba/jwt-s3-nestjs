import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export default class LoginDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'mail' })
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({ example: '12345', description: 'password' })
  @IsString()
  @Length(4, 100)
  readonly password: string;
}
