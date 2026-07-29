import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateBidDto {
  @ApiProperty({
    example: 'accepted',
    description: 'Bid status',
    enum: ['pending', 'accepted', 'rejected'],
  })
  @IsIn(['pending', 'accepted', 'rejected'])
  bidStatus!: 'pending' | 'accepted' | 'rejected';
}
