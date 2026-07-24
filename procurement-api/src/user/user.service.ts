import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.users.findOneBy({ email: email.toLowerCase() });
  }

  async createUser(data: CreateUserDto) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const user = this.users.create(data);
    return this.users.save(user);
  }

  findAll() {
    return this.users.find();
  }

  async findOne(id: string) {
    return await this.users.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.users.update({ id }, updateUserDto);
  }

  async remove(id: string) {
    return await this.users.delete({ id });
  }
}
