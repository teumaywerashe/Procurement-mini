import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CollectionQueryDto } from '../../common/dto/collection-query.dto';

export class TenderFilterDto extends CollectionQueryDto {
  /** @deprecated use ?q= instead; kept for backwards compat */
  @ApiPropertyOptional({ example: 'construction' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 10000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}
