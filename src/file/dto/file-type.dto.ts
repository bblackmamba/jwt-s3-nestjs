import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum, IsNumber, IsOptional, IsString, Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import FileTypeEnum from '../enums/file-type.enum';

export default class FileTypeDto {
  @ApiProperty({ example: FileTypeEnum.Video, enum: FileTypeEnum })
  @IsEnum(FileTypeEnum)
  readonly type: FileTypeEnum;

  @ApiProperty({ required: true, example: 0 })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;

  @ApiProperty({ type: Object })
    file?: Express.Multer.File;

  @ApiProperty({ example: 'Event title (4 symb min)' })
  @IsOptional()
  @IsString()
  @Length(4)
  readonly title: string;

  @ApiProperty({ example: 'Event description (4 symb min)' })
  @IsOptional()
  @IsString()
  readonly description: string;
}
