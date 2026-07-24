import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vendor } from '../../vendor/entities/vendor.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VENDOR = 'vendor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
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
  createdAt!: Date;

  @OneToOne(() => Vendor, (vendor) => vendor.user)
  vendor?: Vendor;
}
