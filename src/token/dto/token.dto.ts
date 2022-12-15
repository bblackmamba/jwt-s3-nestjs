import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class TokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIU....', required: true })
  @IsString()
    token: string;
}
