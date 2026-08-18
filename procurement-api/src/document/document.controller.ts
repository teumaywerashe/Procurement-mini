import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Delete,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/types';
import { UserRole } from '../user/enum/userRole.enum';
import { Public } from '../auth/decorators/public.decorator';

interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}

@ApiTags('Documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('tender/:tenderId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload document to a tender (Admin only)' })
  uploadTenderDocument(
    @UploadedFile() file: UploadFile,
    @Param('tenderId') tenderId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.documentService.uploadTenderDocument(file, +tenderId, user);
  }

  @Post('bid/:bidId')
  @Roles(UserRole.VENDOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload document to a bid (Vendor only)' })
  uploadBidDocument(
    @UploadedFile() file: UploadFile,
    @Param('bidId') bidId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.documentService.uploadBidDocument(file, +bidId, user);
  }

  @Delete(':docId')
  @ApiOperation({ summary: 'Delete a document' })
  deleteDocument(
    @Param('docId') docId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentService.deleteDocument(+docId, user);
  }

  @Get(':docId/url')
  @Public()
  @ApiOperation({ summary: 'Get presigned download URL for a document' })
  getPresignedUrl(
    @Param('docId') docId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentService.getPresignedUrl(+docId, user);
  }

  @Get('tender/:tenderId')
  @Public()
  @ApiOperation({
    summary: 'Get all documents for a tender (public for published tenders)',
  })
  getTenderDocuments(
    @Param('tenderId') tenderId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentService.getTenderDocuments(+tenderId, user);
  }

  @Get('bid/:bidId')
  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary:
      'Get all documents for a bid (accessible to bid owner vendor and tender owner admin)',
  })
  getBidDocuments(
    @Param('bidId') bidId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentService.getBidDocuments(+bidId, user);
  }
}
