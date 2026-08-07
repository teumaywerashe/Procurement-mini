// import { Test, TestingModule } from '@nestjs/testing';
// import { TenderService } from './tender.service';
// import { ForbiddenException, NotFoundException } from '@nestjs/common';
// import { UserRole } from '../user/enum/userRole.enum';
// import type { JwtPayload } from '../auth/decorators/types';

jest.mock('../database/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
      tender: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
  },
}));
