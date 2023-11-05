import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 70, nullable: false })
  public name: string;

  @Column({ length: 70, nullable: false })
  public slug: string;

  @Column({ length: 150, nullable: false })
  public email: string;

  @Column({ length: 255, nullable: false })
  public password: string;

  @Column({ length: 255, nullable: true })
  public image: string;

  @Column({ length: 255, nullable: true })
  public walletAddress: string;

  constructor() {
    this.id = randomUUID();
  }
}
