import { randomUUID } from 'crypto';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'page_customizations',
})
export class PageCustomized {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 255, name: 'image_background' })
  public imageBackground: string;

  @Column({ name: 'enable_total_supporters' })
  public enableTotalSupporters: boolean;

  @Column({
    type: 'varchar',
    length: 70,
    name: 'theme_color',
    default: 'black',
  })
  public themeColor: string;

  @Column({ type: 'varchar', length: 150, name: 'what_are_you_doing' })
  public whatAreYouDoing: string;

  @Column({ type: 'varchar', length: 255, name: 'featured_video' })
  public featuredVideo: string;

  @Column({ type: 'text', name: 'description' })
  public description: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  constructor() {
    this.id = randomUUID();
  }
}
