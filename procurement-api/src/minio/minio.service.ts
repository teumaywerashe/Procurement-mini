import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Client } from 'minio';

dotenv.config({ path: '../.env' });

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly client?: Client;
  private readonly bucketName: string =
    process.env.MINIO_BUCKET || 'procurement-documents';
  private readonly enabled: boolean;

  constructor() {
    const endPoint = process.env.MINIO_ENDPOINT;
    const port = parseInt(process.env.MINIO_PORT || '9000');
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const accessKey = process.env.MINIO_ACCESS_KEY;
    const secretKey = process.env.MINIO_SECRET_KEY;

    if (!endPoint || !accessKey || !secretKey) {
      this.logger.warn(
        'MinIO configuration is incomplete - file upload features will be disabled',
      );
      this.enabled = false;
      return;
    }

    this.enabled = true;
    this.client = new Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });

    this.bucketName = process.env.MINIO_BUCKET || 'procurement-documents';

    void this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    if (!this.client) {
      return;
    }

    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName);
        this.logger.log(`Created MinIO bucket: ${this.bucketName}`);
      }
    } catch (error) {
      this.logger.error('Failed to ensure bucket exists', error);
      throw error;
    }
  }

  async uploadFile(
    file: {
      buffer: Buffer;
      mimetype: string;
      size: number;
      originalname: string;
    },
    objectKey: string,
  ): Promise<string> {
    if (!this.client) {
      throw new BadRequestException('File upload is not configured');
    }

    try {
      const metadata = {
        'Content-Type': file.mimetype,
        'Content-Length': String(file.size),
      };

      await this.client.putObject(
        this.bucketName,
        objectKey,
        file.buffer,
        file.size,
        metadata,
      );

      this.logger.log(`Uploaded file to ${objectKey}`);
      return objectKey;
    } catch (error) {
      this.logger.error('Failed to upload file to MinIO', error);
      throw new BadRequestException('Failed to upload file');
    }
  }

  async deleteFile(objectKey: string): Promise<void> {
    if (!this.client) {
      throw new BadRequestException('File upload is not configured');
    }

    try {
      await this.client.removeObject(this.bucketName, objectKey);
      this.logger.log(`Deleted file from ${objectKey}`);
    } catch (error) {
      this.logger.error('Failed to delete file from MinIO', error);
      throw new BadRequestException('Failed to delete file');
    }
  }

  async getPresignedUrl(objectKey: string): Promise<string> {
    if (!this.client) {
      throw new BadRequestException('File upload is not configured');
    }

    try {
      const url = await this.client.presignedGetObject(
        this.bucketName,
        objectKey,
      );
      return url;
    } catch (error) {
      this.logger.error('Failed to generate presigned URL', error);
      throw new BadRequestException('Failed to generate download URL');
    }
  }

  async fileExists(objectKey: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      await this.client.statObject(this.bucketName, objectKey);
      return true;
    } catch {
      return false;
    }
  }
}
