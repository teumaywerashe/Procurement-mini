import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  registrationNumber!: string;

  @ApiPropertyOptional({ example: 'vendor@acme.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
  @ApiPropertyOptional({ example: '+251-914101234' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
