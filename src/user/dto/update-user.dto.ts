import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined, IsOptional, IsString, Length, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import Password from './passwords-old-new.dto';

export default class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  @ValidateNested()
  @Type(() => Password)
  readonly password?: Password;

  @ApiProperty({
    required: false,
    type: String,
    example: 'username',
  })
  @IsOptional()
  @IsString()
  @Length(3, 45)
  readonly name?: string;

  @ApiProperty({ type: String, description: 'File or "delete" to delete avatar' })
  @IsOptional()
  readonly avatar?: Express.Multer.File | string;
}
