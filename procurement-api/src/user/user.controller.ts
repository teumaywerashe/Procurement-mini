import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
import { UserRole } from './enum/userRole..enum';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  async findAll(@CurrentUser() user: JwtPayload) {
    if (user.role !== (UserRole.ADMIN as string)) {
      throw new ForbiddenException('Only admins can view all users');
    }
    return await this.userService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return await this.userService.findOne(user.uid);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (own profile or admin)' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    if (user.role !== (UserRole.ADMIN as string) && user.uid !== id) {
      throw new ForbiddenException(
        'You can only view your own profile or you should be an admin to view other users',
      );
    }
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user (own profile or admin)' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    if (user.role !== (UserRole.ADMIN as string) && user.uid !== id) {
      throw new ForbiddenException(
        'You can only update your own profile or you should be an admin to update other users',
      );
    }
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user (admin only)' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
