import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserRole } from '../enum/userRole..enum';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  name!: string;
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
  role?: UserRole;
  vendorId?: string;
}
