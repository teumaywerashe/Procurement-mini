import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { VendorService } from '../vendor/vendor.service';
import { UserRole } from '../user/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  const userService = {
    createUser: jest.fn(),
    findByEmail: jest.fn(),
  };
  const jwtService = { sign: jest.fn() };
  const vendorService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: VendorService, useValue: vendorService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('assigns the vendor role and ID for a vendor signup', async () => {
    userService.findByEmail.mockResolvedValue(null);
    vendorService.findOne.mockResolvedValue({ id: 'vendor-id' });
    userService.createUser.mockResolvedValue({
      id: 'user-id',
      email: 'owner@acme.com',
      role: UserRole.VENDOR,
      vendorId: 'vendor-id',
    });
    jwtService.sign.mockReturnValue('access-token');

    await service.register({
      name: 'Vendor Owner',
      email: 'owner@acme.com',
      password: 'secure-password-123',
      vendorId: 'vendor-id',
    });

    expect(userService.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        role: UserRole.VENDOR,
        vendorId: 'vendor-id',
      }),
    );
  });
});
