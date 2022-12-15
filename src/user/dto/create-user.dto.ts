import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export default class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'mail' })
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Incorrect email' })
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({ example: '12345', description: 'password' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 100, { message: 'Not less than 4 and not more than 100' })
  readonly password: string;

  @ApiProperty({ example: 'username', description: 'name' })
  @IsString({ message: 'Must be a string' })
  @Length(3, 45, { message: 'Not less than 4 and not more than 50' })
  readonly name: string;
}
