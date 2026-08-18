import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class DocumentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'document.pdf' })
  fileName: string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ example: 1024 })
  fileSize: number;

  @ApiProperty({ example: 'tenders/1/documents/document.pdf' })
  objectKey: string;

  @ApiProperty({ example: 1, required: false })
  tenderId?: number;

  @ApiProperty({ example: 1, required: false })
  bidId?: number;

  @ApiProperty({ example: '2026-08-18T10:00:00.000Z' })
  createdAt: string;
}
