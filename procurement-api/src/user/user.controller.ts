import {
  BadRequestException,
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
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/types';
import { UserRole } from './enum/userRole.enum';
import { AdminOrOwnerGuard } from '../auth/guards/adminOrOwner.guard';
import { IsSuperAdminGuard } from '../auth/guards/isSuperAdmin.guard';
import { IsSuperAdmin } from '../auth/decorators/isSuperAdmin.decorator';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard, AdminOrOwnerGuard, IsSuperAdminGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create user or admin (super_admin only)' })
  async create(@Body() createUserDto: any) {
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

  @Patch(':id/profile')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({
    summary: 'Update own profile - vendors can update name and password',
  })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    // Users can only update their own profile
    if (String(currentUser.uid) !== id) {
      throw new BadRequestException('You can only update your own profile');
    }

    return await this.userService.update(id, updateProfileDto);
  }

  @Patch(':id/role')
  @IsSuperAdmin()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Update user role (super_admin only)',
  })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.userService.update(id, {
      role: updateRoleDto.role,
    } as any);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete user (super_admin only)' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  @Post(':id/role')
  @IsSuperAdmin()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Set user role (super_admin only)' })
  async setRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return await this.userService.update(id, { role: dto.role } as any);
  }
}
