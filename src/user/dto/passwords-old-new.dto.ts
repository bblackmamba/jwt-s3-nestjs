import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export default class PasswordsOldNewDto {
  @ApiProperty({
    required: true,
    type: String,
    example: '12345',
    description: 'Old password',
  })
  @IsString()
  @Length(4, 16)
  readonly old: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '12345',
    description: 'New password',
  })
  @IsString()
  @Length(4, 16)
  readonly new: string;
}
