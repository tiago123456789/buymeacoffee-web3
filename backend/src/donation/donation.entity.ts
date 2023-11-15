import { randomUUID } from 'crypto';
import { User } from '../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'receiver_id' })
  public receiver: User;

  @Column({ length: 255, name: 'donator_address' })
  public donatorAddress: string;

  @Column({ length: 255 })
  public message: string;

  @Column({ type: 'decimal', scale: 5 })
  public value: number;

  @Column({ type: 'timestamp', name: 'created_at' })
  public createdAt: Date;

  @Column({ type: 'timestamp', name: 'updated_at' })
  public updatedAt: Date;

  constructor() {
    this.id = randomUUID();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
