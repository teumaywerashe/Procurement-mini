import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginVendorDto {
  @ApiProperty({ example: '123456789' })
  @IsString({ message: 'Registration number must be a string' })
  registrationNumber!: string;
}
