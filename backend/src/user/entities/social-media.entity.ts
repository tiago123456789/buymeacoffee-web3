import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { randomUUID } from 'crypto';

@Entity({ name: 'social_medias' })
export class SocialMedia {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column({ length: 250, nullable: false })
  public link: string;

  constructor() {
    this.id = randomUUID();
  }
}
