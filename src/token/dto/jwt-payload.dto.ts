import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export default class JwtPayloadDto {
  @ApiProperty({ required: true })
  @IsString()
    email: string;

  @ApiProperty({ required: true })
  @IsNumber()
    id: number;
}
