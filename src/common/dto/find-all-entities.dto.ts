import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export default class FindAllEntitiesDto {
  @ApiProperty({ example: 5, required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
    limit?: number;

  @ApiProperty({ example: 0, required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
    offset?: number;

  @ApiProperty({
    example: 'id,desc', required: false, default: 'id,asc', type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) {
      return ['id', 'asc'];
    }
    if (Array.isArray(value)) {
      return value;
    }
    const val = value.split(',').map((v) => String(v).trim());
    return [val[0] || 'id', val[1] || 'asc'];
  })
    order?: [string, string];
}
