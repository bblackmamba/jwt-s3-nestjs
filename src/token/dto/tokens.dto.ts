import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class TokensDto {
  @ApiProperty({ required: true })
  @IsString()
    accessToken: string;

  @ApiProperty({ required: true })
  @IsString()
    refreshToken: string;
}
