import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export default class StatusDto {
  @ApiProperty({ required: true })
  @IsBoolean()
    status: boolean;
}
