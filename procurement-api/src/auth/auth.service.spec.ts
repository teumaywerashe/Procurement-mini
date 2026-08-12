import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { db } from '../database/db';

// Mock the db singleton so no real DB connection is needed
jest.mock('../database/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe('AuthService', () => {
  let service: AuthService;
  const jwtService = { sign: jest.fn().mockReturnValue('signed-token') };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: jwtService }],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  // Helper: chain .from().where().execute() returning a value
  function mockSelect(rows: unknown[]) {
    const chain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(rows),
    };
    mockDb.select.mockReturnValue(chain as any);
    return chain;
  }

  function mockInsert(rows: unknown[]) {
    const chain = {
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(rows),
    };
    mockDb.insert.mockReturnValue(chain as any);
    return chain;
  }

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      mockSelect([{ id: 1, email: 'taken@example.com' }]);

      await expect(
        service.register({
          name: 'Alice',
          email: 'taken@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('returns accessToken + user on successful registration', async () => {
      // first select (duplicate check) returns empty
      mockSelect([]);
      mockInsert([
        {
          id: 2,
          name: 'Bob',
          email: 'bob@example.com',
          role: 'Admin',
          createdAt: new Date(),
        },
      ]);

      const result = await service.register({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken', 'signed-token');
      expect(result.user).toMatchObject({
        email: 'bob@example.com',
        role: 'Admin',
      });
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException for wrong password', async () => {
      const hashed = await service.hashPassword('correct-password');
      mockSelect([
        {
          id: 1,
          email: 'user@example.com',
          password: hashed,
          role: 'Vendor',
          name: 'User',
          createdAt: new Date(),
        },
      ]);

      await expect(
        service.login({
          email: 'user@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns accessToken on valid credentials', async () => {
      const hashed = await service.hashPassword('correct-password');
      mockSelect([
        {
          id: 1,
          email: 'user@example.com',
          password: hashed,
          role: 'Vendor',
          name: 'User',
          createdAt: new Date(),
        },
      ]);

      const result = await service.login({
        email: 'user@example.com',
        password: 'correct-password',
      });

      expect(result).toHaveProperty('accessToken', 'signed-token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ uid: 1, email: 'user@example.com' }),
      );
    });
  });
});
