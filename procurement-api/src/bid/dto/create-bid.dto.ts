import { IsNumber } from 'class-validator';

export class CreateBidDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  amount!: number;

  @IsNumber({}, { message: 'Tender ID must be a number' })
  tenderId!: number;
}
