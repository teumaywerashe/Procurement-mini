import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { db } from '../database/db';
import { document, tender, bid, users } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import type { JwtPayload } from '../auth/decorators/types';
import { UserRole } from '../user/enum/userRole.enum';

interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(private readonly minioService: MinioService) {}

  async uploadTenderDocument(
    file: UploadFile,
    tenderId: number,
    user: JwtPayload,
  ) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only admins can upload tender documents');
    }

    const [tenderExists] = await db
      .select()
      .from(tender)
      .where(eq(tender.id, tenderId))
      .execute();

    if (!tenderExists) {
      throw new NotFoundException(`Tender ${tenderId} not found`);
    }

    if (user.role === UserRole.ADMIN && tenderExists.createdBy !== user.uid) {
      throw new ForbiddenException('You can only upload to your own tenders');
    }

    const objectKey = `tenders/${tenderId}/documents/${Date.now()}-${file.originalname}`;

    await this.minioService.uploadFile(file, objectKey);

    const [doc] = await db
      .insert(document)
      .values({
        fileName: file.originalname,
        objectKey,
        mimeType: file.mimetype,
        fileSize: file.size,
        tenderId,
        uploadedBy: user.uid,
      })
      .returning()
      .execute();

    return doc;
  }

  async uploadBidDocument(
    file: UploadFile,
    bidId: number,
    user: JwtPayload,
  ) {
    if (user.role !== UserRole.VENDOR) {
      throw new ForbiddenException('Only vendors can upload bid documents');
    }

    const bidExists = await db.query.bid.findFirst({
      where: { id: bidId } as any,
      with: { vendor: true },
    });

    if (!bidExists) {
      throw new NotFoundException(`Bid ${bidId} not found`);
    }

    if (bidExists.vendor === null) {
      throw new NotFoundException('Vendor not found for this bid');
    }

    if (bidExists.vendor.ownerId !== user.uid) {
      throw new ForbiddenException('You can only upload to your own bids');
    }

    const objectKey = `bids/${bidId}/documents/${Date.now()}-${file.originalname}`;

    await this.minioService.uploadFile(file, objectKey);

    const [doc] = await db
      .insert(document)
      .values({
        fileName: file.originalname,
        objectKey,
        mimeType: file.mimetype,
        fileSize: file.size,
        bidId,
        uploadedBy: user.uid,
      })
      .returning()
      .execute();

    return doc;
  }

  async deleteDocument(docId: number, user: JwtPayload) {
    const doc = await db.query.document.findFirst({
      where: { id: docId } as any,
      with: { tender: true, bid: true },
    });

    if (!doc) {
      throw new NotFoundException(`Document ${docId} not found`);
    }

    if (user.role === UserRole.ADMIN) {
      if (doc.tenderId) {
        const tenderExists = await db.query.tender.findFirst({
          where: { id: doc.tenderId } as any,
        });
        if (tenderExists?.createdBy !== user.uid) {
          throw new ForbiddenException('This is not your tender');
        }
      }
    } else if (user.role === UserRole.VENDOR) {
      if (doc.bidId) {
        const bidExists = await db.query.bid.findFirst({
          where: { id: doc.bidId } as any,
          with: { vendor: true },
        });
        if (
          !bidExists ||
          !bidExists.vendor ||
          bidExists.vendor.ownerId !== user.uid
        ) {
          throw new ForbiddenException('This is not your bid');
        }
      }
    }

    await this.minioService.deleteFile(doc.objectKey);

    await db.delete(document).where(eq(document.id, docId)).execute();

    return { success: true, message: 'Document deleted successfully' };
  }

  async getPresignedUrl(docId: number, user: JwtPayload) {
    const doc = await db.query.document.findFirst({
      where: { id: docId } as any,
      with: { tender: true, bid: true },
    });

    if (!doc) {
      throw new NotFoundException(`Document ${docId} not found`);
    }

    if (user.role === UserRole.ADMIN) {
      if (doc.tenderId) {
        const tenderExists = await db.query.tender.findFirst({
          where: { id: doc.tenderId } as any,
        });
        if (tenderExists?.createdBy !== user.uid) {
          throw new ForbiddenException('This is not your tender');
        }
      } else if (doc.bidId) {
        const bidExists = await db.query.bid.findFirst({
          where: { id: doc.bidId } as any,
          with: { tender: true },
        });
        if (
          !bidExists ||
          !bidExists.tender ||
          bidExists.tender.createdBy !== user.uid
        ) {
          throw new ForbiddenException('This is not your tender');
        }
      }
    } else if (user.role === UserRole.VENDOR) {
      if (doc.bidId) {
        const bidExists = await db.query.bid.findFirst({
          where: { id: doc.bidId } as any,
          with: { vendor: true },
        });
        if (
          !bidExists ||
          !bidExists.vendor ||
          bidExists.vendor.ownerId !== user.uid
        ) {
          throw new ForbiddenException('This is not your bid');
        }
      }
    }

    const url = await this.minioService.getPresignedUrl(doc.objectKey);
    return { url, fileName: doc.fileName };
  }

  async getTenderDocuments(tenderId: number, user: JwtPayload) {
    if (user.role === UserRole.ADMIN) {
      const tenderExists = await db.query.tender.findFirst({
        where: { id: tenderId } as any,
      });
      if (tenderExists?.createdBy !== user.uid) {
        throw new ForbiddenException('This is not your tender');
      }
    }

    const docs = await db
      .select()
      .from(document)
      .where(eq(document.tenderId, tenderId))
      .orderBy(document.createdAt);

    return docs;
  }

  async getBidDocuments(bidId: number, user: JwtPayload) {
    const bidExists = await db.query.bid.findFirst({
      where: { id: bidId } as any,
      with: { vendor: true },
    });

    if (!bidExists) {
      throw new NotFoundException(`Bid ${bidId} not found`);
    }

    if (bidExists.vendor === null) {
      throw new NotFoundException('Vendor not found for this bid');
    }

    if (user.role === UserRole.VENDOR && bidExists.vendor.ownerId !== user.uid) {
      throw new ForbiddenException('You can only view documents for your own bids');
    }

    const docs = await db
      .select()
      .from(document)
      .where(eq(document.bidId, bidId))
      .orderBy(document.createdAt);

    return docs;
  }
}
