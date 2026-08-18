import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNotifiactionDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
