import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { VendorService } from '../vendor/vendor.service';
import { UserRole } from '../user/entities/user.entity';

type User = {
  id: string;
  email: string;
  role: string;
  vendorId: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly vendorService: VendorService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    if (registerDto.vendorId) {
      const vendor = await this.vendorService.findOne(registerDto.vendorId);
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }
    }

    const password = await this.hashPassword(registerDto.password);
    const user = await this.userService.createUser({
      ...registerDto,
      password,
      role: registerDto.vendorId ? UserRole.VENDOR : UserRole.USER,
    });
    return this.toAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.toAuthResponse(user);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, storedPassword);
  }

  private toAuthResponse(user: User) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        vendorId: user.vendorId,
      },
    };
  }
}
