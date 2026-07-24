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
  name!: string;
  @IsString()
  @Column({ unique: true })
  registrationNumber!: string;
  @IsString()
  @Column({ nullable: true })
  email?: string;
  @IsString()
  @Column({ nullable: true })
  phoneNumber?: string;

  @OneToOne(() => User, (user) => user.vendor)
  @JoinColumn()
  user!: User;
}
