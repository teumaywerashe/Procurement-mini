/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { users } from '../database/schema/user.schema';
import { db } from '../database/db';
import * as bcrypt from 'bcryptjs';

function omitPassword<T extends { password?: string }>(
  user: T,
): Omit<T, 'password'> {
  const { password: pw, ...safe } = user;
  return safe;
}

@Injectable()
export class UserService {
  constructor() {}

  async findByEmail(email: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
    return user.map(omitPassword);
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser && existingUser.length > 0) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role ?? ('Admin' as any),
      })
      .returning()
      .execute();
    return omitPassword(newUser);
  }

  async findAll() {
    const allUsers = await db.select().from(users).execute();
    return allUsers.map(omitPassword);
  }

  async findOne(id: string) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();
    return result.map(omitPassword);
  }

  async update(id: string, updateUserDto: any) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Prevent email updates
    if (updateUserDto.email !== undefined) {
      throw new BadRequestException('Email cannot be updated');
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const [updated] = await db
      .update(users)
      .set(updateUserDto)
      .where(eq(users.id, userId))
      .returning()
      .execute();

    return {
      updated: omitPassword(updated),
      success: true,
      message: 'User updated successfully',
    };
  }

  async remove(id: string) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning()
      .execute();
    return {
      deleted: omitPassword(deleted),
      success: true,
      message: 'User deleted successfully',
    };
  }
}
