import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TenderFilterDto {
  @ApiPropertyOptional({
    example: 'construction',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;
}
