import { IsInt, IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  description?: string;

  @IsInt()
  @IsOptional()
  tenderId?: number;

  @IsInt()
  @IsOptional()
  bidId?: number;
}
