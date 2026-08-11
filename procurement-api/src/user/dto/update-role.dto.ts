import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enum/userRole.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
