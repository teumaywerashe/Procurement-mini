import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/types';
import { UserRole } from './enum/userRole.enum';
import { AdminOrOwner } from '../auth/decorators/adminOrOwner.decorator';
import { AdminOrOwnerGuard } from '../auth/guards/adminOrOwner.guard';
import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';

class PromoteUserDto {
  @ApiProperty({ enum: UserRole })
  @IsIn(Object.values(UserRole))
  @IsNotEmpty()
  role!: UserRole;
}

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard, AdminOrOwnerGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create user or admin (super_admin only)' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (admin / super_admin only)' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return await this.userService.findOne(user.uid as unknown as string);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (admin / super_admin)' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @AdminOrOwner()
  @ApiOperation({ summary: 'Update user (own profile, admin, or super_admin)' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @AdminOrOwner()
  @ApiOperation({ summary: 'Delete user (admin or super_admin)' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  /** SUPER_ADMIN only: promote or demote any user's role */
  @Post(':id/role')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Set user role (super_admin only)' })
  async setRole(@Param('id') id: string, @Body() dto: PromoteUserDto) {
    return await this.userService.update(id, { role: dto.role } as any);
  }
}
