import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { tenderStatus } from '../enum/tenderStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenderDto {
  @ApiProperty({ example: 'Construction of New Office Building' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Tender for construction of new office building' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example:
      'This tender is for the construction of a new office building in the city center.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'published' })
  @IsString()
  @IsNotEmpty()
  status!: tenderStatus;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  closingDate!: Date;

  @ApiProperty({ example: 1000000.0 })
  @IsNumber()
  estimatedValue!: number;
}
