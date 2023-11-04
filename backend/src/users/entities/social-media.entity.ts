import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { randomUUID } from 'crypto';

@Entity({ name: 'social_medias' })
export class SocialMedia {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Users, (user) => user)
  @JoinColumn({ name: 'user_id' })
  public user: Users;

  @Column({ length: 250, nullable: false })
  public link: string;

  constructor() {
    this.id = randomUUID();
  }
}
