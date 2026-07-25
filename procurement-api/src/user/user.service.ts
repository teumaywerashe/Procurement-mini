import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { users } from '../database/schema/user.schema';
import { db } from '../database/db';

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
    return newUser;
  }

  async findAll() {
    return await db.select().from(users).execute();
  }

  async findOne(id: string) {
    return await db
      .select()
      .from(users)
      .where(eq(users.id, id as any as number))
      .execute();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await db
      .update(users)
      .set(updateUserDto as any as Partial<typeof users>)
      .where(eq(users.id, id as any as number))
      .returning()
      .execute();
  }

  async remove(id: string) {
    return await db
      .delete(users)
      .where(eq(users.id, id as any as number))
      .returning()
      .execute();
  }
}
