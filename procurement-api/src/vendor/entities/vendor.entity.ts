import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IsString } from 'class-validator';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @Column({ unique: true })
  registrationNumber!: string;
  @IsString({ message: 'Email must be a string' })
  @Column({ nullable: true })
  email?: string;
  @IsString({ message: 'Phone number must be a string' })
  @Column({ nullable: true })
  phoneNumber?: string;

  @OneToOne(() => User, (user) => user.vendor)
  @JoinColumn()
  user!: User;
}
