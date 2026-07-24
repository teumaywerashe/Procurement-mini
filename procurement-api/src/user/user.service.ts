import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.users.findOneBy({ email: email.toLowerCase() });
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    vendorId?: string;
  }) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const user = this.users.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role ?? UserRole.USER,
      vendorId: data.vendorId ?? null,
    });
    return this.users.save(user);
  }

  findAll() {
    return this.users.find();
  }

  findOne(id: string) {
    return this.users.findOneBy({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.users.update({ id }, updateUserDto);
  }

  remove(id: string) {
    return this.users.delete({ id });
  }
}
