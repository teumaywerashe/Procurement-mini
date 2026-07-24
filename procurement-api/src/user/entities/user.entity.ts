import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { IsDate, IsEmail, IsString, MinLength } from 'class-validator';
import { UserRole } from '../enum/userRole..enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @Column({
    unique: true,
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @Column()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ type: 'varchar', nullable: true })
  vendorId!: string | null;

  @CreateDateColumn()
  @IsDate({ message: 'createdAt must be a valid date' })
  createdAt!: Date;

  @OneToOne(() => Vendor, (vendor) => vendor.user)
  vendor?: Vendor;
}
