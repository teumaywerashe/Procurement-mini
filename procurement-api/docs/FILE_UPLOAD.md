# File Upload System with MinIO

This document describes the file upload system implemented for the procurement API using MinIO as the object storage backend.

## Overview

The file upload system allows:
- **Admin users** to upload documents associated with tenders (PDF, DOCX, XLSX files)
- **Vendor users** to upload documents associated with their bids (technical proposals, financial proposals, supporting documents)

## Architecture

### Components

1. **MinIOService** - Handles file operations with MinIO:
   - Upload files to the MinIO bucket
   - Generate presigned URLs for temporary access
   - Delete files from the bucket

2. **DocumentService** - Handles business logic for document management:
   - Upload documents to tenders or bids
   - Verify user permissions
   - Store metadata in PostgreSQL

3. **DocumentController** - REST API endpoints for document operations

### Storage Structure

Files are stored in MinIO with the following object key structure:
- Tenders: `tenders/{tenderId}/documents/{uniqueFileName}`
- Bids: `bids/{bidId}/documents/{uniqueFileName}`

### Database Schema

The `document` table stores metadata about uploaded files:

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| fileName | VARCHAR(255) | Original file name |
| objectKey | VARCHAR(512) | Unique MinIO object key |
| mimeType | VARCHAR(100) | MIME type of the file |
| fileSize | INTEGER | File size in bytes |
| tenderId | INTEGER | Foreign key to tenders (nullable) |
| bidId | INTEGER | Foreign key to bids (nullable) |
| uploadedBy | INTEGER | Foreign key to users |
| createdAt | TIMESTAMP | Upload timestamp |

## Configuration

Add these environment variables to your `.env` file:

```env
# MinIO Configuration
MINIO_ENDPOINT=minio.example.com
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=procurement-documents
MINIO_USE_SSL=false
```

## API Endpoints

### Upload Tender Document

**Endpoint:** `POST /documents/tender/:tenderId`

**Role:** Admin, SuperAdmin

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (required)

**Example:**
```bash
curl -X POST http://localhost:5000/documents/tender/1 \
  -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "id": 1,
  "fileName": "document.pdf",
  "objectKey": "tenders/1/documents/1692345678901-document.pdf",
  "mimeType": "application/pdf",
  "fileSize": 102400,
  "tenderId": 1,
  "createdAt": "2026-08-18T10:00:00.000Z"
}
```

### Upload Bid Document

**Endpoint:** `POST /documents/bid/:bidId`

**Role:** Vendor

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (required)

**Example:**
```bash
curl -X POST http://localhost:5000/documents/bid/5 \
  -H "Authorization: Bearer <token>" \
  -F "file=@proposal.pdf"
```

**Response:**
```json
{
  "id": 2,
  "fileName": "proposal.pdf",
  "objectKey": "bids/5/documents/1692345678901-proposal.pdf",
  "mimeType": "application/pdf",
  "fileSize": 204800,
  "bidId": 5,
  "createdAt": "2026-08-18T10:00:00.000Z"
}
```

### Get Presigned Download URL

**Endpoint:** `GET /documents/:docId/url`

**Access:**
- Admin: Can access any document
- Vendor: Can only access documents for their own bids

**Example:**
```bash
curl -X GET http://localhost:5000/documents/1/url \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "url": "https://minio.example.com/procurement-documents/tenders/1/documents/1692345678901-document.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "fileName": "document.pdf"
}
```

The URL is temporary (typically 7 days) and allows direct download from MinIO.

### Get Tender Documents

**Endpoint:** `GET /documents/tender/:tenderId`

**Role:** Admin, SuperAdmin

**Example:**
```bash
curl -X GET http://localhost:5000/documents/tender/1 \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
[
  {
    "id": 1,
    "fileName": "document.pdf",
    "objectKey": "tenders/1/documents/1692345678901-document.pdf",
    "mimeType": "application/pdf",
    "fileSize": 102400,
    "tenderId": 1,
    "createdAt": "2026-08-18T10:00:00.000Z"
  }
]
```

### Get Bid Documents

**Endpoint:** `GET /documents/bid/:bidId`

**Role:** Vendor

**Example:**
```bash
curl -X GET http://localhost:5000/documents/bid/5 \
  -H "Authorization: Bearer <token>"
```

### Delete Document

**Endpoint:** `DELETE /documents/:docId`

**Access:**
- Admin: Can delete any document on their tenders
- Vendor: Can only delete documents on their own bids

**Example:**
```bash
curl -X DELETE http://localhost:5000/documents/1 \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

## Security

### File Storage
- MinIO bucket is private (no public URLs)
- Temporary presigned URLs are generated for downloads
- URLs expire after a configurable period

### Access Control
- Admins can only upload/manage documents for their own tenders
- Vendors can only upload/manage documents for their own bids
- All operations require valid JWT authentication

### Validation
- File type is stored but not validated on upload (could be extended)
- File size is tracked in the database

## Usage in Production

1. Set up a MinIO server (self-hosted or use a managed service)
2. Configure environment variables
3. Run database migrations: `npm run db migrate`
4. The MinIO service automatically creates the bucket on startup if it doesn't exist

## Migration

Run the database migration to create the document table:

```bash
cd procurement-api
npx drizzle-kit generate
npx drizzle-kit migrate
```
