import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateBidDto {
  @ApiProperty({ example: 1000, description: 'The amount of the bid' })
  @IsNumber({}, { message: 'Amount must be a number' })
  amount!: number;

  @ApiProperty({ example: 7, description: 'The ID of the tender' })
  @IsNumber({}, { message: 'Tender ID must be a number' })
  tenderId!: number;
}
