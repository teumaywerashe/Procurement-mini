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
  const { password: _pw, ...safe } = user;
  return safe;
}

@Injectable()
export class UserService {
  constructor() {}

  async findByEmail(email: string) {
    return await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
  }

  async createUser(CreateUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(CreateUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const newUser = await db
      .insert(users)
      .values(CreateUserDto)
      .returning()
      .execute();
    return newUser.map(omitPassword);
  }

  async findAll() {
    const allUsers = await db.select().from(users).execute();
    return allUsers.map(omitPassword);
  }

  async findOne(id: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id as any as number))
      .execute();
    return result.map(omitPassword);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id as any as number))
      .execute();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const [updated] = await db
      .update(users)
      .set(updateUserDto as any as Partial<typeof users>)
      .where(eq(users.id, id as any as number))
      .returning()
      .execute();
    return {
      updated: omitPassword(updated),
      success: true,
      message: 'User updated successfully',
    };
  }

  async remove(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id as any as number))
      .execute();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, id as any as number))
      .returning()
      .execute();
    return {
      deleted: omitPassword(deleted),
      success: true,
      message: 'User deleted successfully',
    };
  }
}
