import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { users } from '../database/schema/user.schema';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { db } from '../database/db';
import { vendor } from '../database/schema/vendor.schema';
type User = {
  id: number;
  email: string;
  role: string;
  vendorId: number | null;
};

@Injectable()
export class AuthService {
  constructor(
    // private readonly userService: UserService,
    private readonly jwtService: JwtService,
    // private readonly vendorService: VendorService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, registerDto.email))
      .execute();
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    if (registerDto.vendorId) {
      const existingVendor = await db
        .select()
        .from(vendor)
        .where(eq(vendor.id, registerDto.vendorId))
        .execute();
      if (!existingVendor) {
        throw new NotFoundException('Vendor not found');
      }
    }

    const password = await this.hashPassword(registerDto.password);
    const [user] = await db
      .insert(users)
      .values({
        ...registerDto,
        password,
      })
      .returning()
      .execute();
    return this.toAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, loginDto.email))
      .execute();
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
        uid: user.id,
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
