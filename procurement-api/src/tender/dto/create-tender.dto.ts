import { IsOptional, IsString } from 'class-validator';
import { tenderStatus } from '../enum/tenderStatus.enum';

export class CreateTenderDto {
  @IsString()
  name!: string;

  @IsOptional()
  description?: string;

  status!: tenderStatus;
}
