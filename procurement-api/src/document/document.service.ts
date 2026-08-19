/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { db } from '../database/db';
import { document, tender, users } from '../database/schema';
import { eq } from 'drizzle-orm';
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

  async uploadBidDocument(file: UploadFile, bidId: number, user: JwtPayload) {
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
    });

    if (!doc) {
      throw new NotFoundException(`Document ${docId} not found`);
    }

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
        throw new ForbiddenException('Only the vendor who created this bid can delete its documents');
      }
    } else if (doc.tenderId) {
      if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
        throw new ForbiddenException('Only admins can delete tender documents');
      }
      const tenderExists = await db.query.tender.findFirst({
        where: { id: doc.tenderId } as any,
      });
      if (user.role === UserRole.ADMIN && tenderExists?.createdBy !== user.uid) {
        throw new ForbiddenException('This is not your tender');
      }
    }

    await this.minioService.deleteFile(doc.objectKey);

    await db.delete(document).where(eq(document.id, docId)).execute();

    return { success: true, message: 'Document deleted successfully' };
  }

  async getPresignedUrl(docId: number, user: JwtPayload | null) {
    const doc = await db.query.document.findFirst({
      where: { id: docId } as any,
      with: { tender: true, bid: true },
    });
    // console.log(doc);
    if (!doc) {
      throw new NotFoundException(`Document ${docId} not found`);
    }

    // Check authorization based on document type
    if (doc.tenderId) {
      // Tender document - public access allowed for published tenders
      if (doc.tender?.status === 'published') {
        // Public users can access published tender documents
        const url = await this.minioService.getPresignedUrl(doc.objectKey);
        return { url, fileName: doc.fileName };
      }
      // For non-published tenders, require authentication and ownership
      if (!user) {
        throw new ForbiddenException('This document requires authentication');
      }
      if (user.role === UserRole.ADMIN) {
        if (doc.tender?.createdBy !== user.uid) {
          throw new ForbiddenException('This is not your tender');
        }
      } else if (user.role === UserRole.VENDOR) {
        // Vendors can access documents for tenders they've bid on
        const bidExists = await db.query.bid.findFirst({
          where: {
            tenderId: doc.tenderId,
            vendorId: user.uid,
          } as any,
        });
        if (!bidExists) {
          throw new ForbiddenException(
            'You do not have access to this document',
          );
        }
      }
    } else if (doc.bidId) {
      // Bid document - private, only accessible by vendor or admin
      if (!user) {
        throw new ForbiddenException('This document requires authentication');
      }
      if (user.role === UserRole.ADMIN) {
        // Admin can access bid documents for their own tenders
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
      } else if (user.role === UserRole.VENDOR) {
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

  async getTenderDocuments(tenderId: number, user?: JwtPayload) {
    const tenderExists = await db.query.tender.findFirst({
      where: { id: tenderId } as any,
    });

    if (!tenderExists) {
      throw new NotFoundException(`Tender ${tenderId} not found`);
    }
    else if (user?.role === UserRole.ADMIN) {
      // Admin access - must own the tender
      if (tenderExists.createdBy !== user.uid) {
        throw new ForbiddenException('This is not your tender');
      }
    } else if (user?.role === UserRole.VENDOR) {
      const bidExists = await db.query.bid.findFirst({
        where: {
          tenderId,
          vendorId: user.uid,
        } as any,
      });
      if (!bidExists) {
        throw new ForbiddenException('You do not have access to this tender');
      }
    } else if (!user) {
      throw new ForbiddenException('This document requires authentication');
    }

    const docs = await db
      .select({
        id: document.id,
        fileName: document.fileName,
        objectKey: document.objectKey,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        tenderId: document.tenderId,
        bidId: document.bidId,
        uploadedBy: document.uploadedBy,
        createdAt: document.createdAt,
        uploadedByUser: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(document)
      .where(eq(document.tenderId, tenderId))
      .leftJoin(users, eq(document.uploadedBy, users.id))
      .orderBy(document.createdAt);

    return docs;
  }

  async getBidDocuments(bidId: number, user?: JwtPayload) {
    const bidExists = await db.query.bid.findFirst({
      where: { id: bidId } as any,
      with: { vendor: true },
    });

    if (!bidExists) {
      throw new NotFoundException(`Bid ${bidId} not found`);
    }

    if (!user) {
      throw new ForbiddenException('This document requires authentication');
    }

    if (user.role === UserRole.VENDOR) {
      if (!bidExists.vendor || bidExists.vendor.ownerId !== user.uid) {
        throw new ForbiddenException(
          'You can only view documents for your own bids',
        );
      }
    } else if (user.role === UserRole.ADMIN) {
      // Admin can only view bid documents for their own tenders
      const tenderExists = await db.query.tender.findFirst({
        where: { id: bidExists.tenderId } as any,
      });
      if (!tenderExists || tenderExists.createdBy !== user.uid) {
        throw new ForbiddenException(
          'You can only view documents for bids on your own tenders',
        );
      }
    }

    const docs = await db
      .select({
        id: document.id,
        fileName: document.fileName,
        objectKey: document.objectKey,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        tenderId: document.tenderId,
        bidId: document.bidId,
        uploadedBy: document.uploadedBy,
        createdAt: document.createdAt,
        uploadedByUser: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(document)
      .where(eq(document.bidId, bidId))
      .leftJoin(users, eq(document.uploadedBy, users.id))
      .orderBy(document.createdAt);

    return docs;
  }
}
