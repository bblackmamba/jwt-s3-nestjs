import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import JwtPayloadDto from './jwt-payload.dto';

export default class GenerateTokensDto {
  @ApiProperty({ required: true })
    jwtPayload: JwtPayloadDto;

  @ApiProperty({ required: true })
  @IsString()
    sessionId: string;
}
