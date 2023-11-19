import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from './user-repository.interface';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardMetricDto } from '../dtos/dashboard-metric.dto';

@Injectable()
export class UserRepository implements UserRepositoryInterface<User> {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async getMetricsByUserId(userId: string): Promise<DashboardMetricDto> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const [totalDonations, totalSupporters, totalValueLast30Days] =
      await Promise.all([
        this.repository.manager.query(
          `
        SELECT COUNT(*) as total FROM donations WHERE receiver_id = $1
      `,
          [userId],
        ),
        this.repository.manager.query(
          `
        select count(items.*) as total from (
          SELECT DISTINCT donator_address FROM donations WHERE receiver_id = $1
        ) as items
      `,
          [userId],
        ),
        this.repository.manager.query(
          `
          SELECT sum(value) as total FROM donations WHERE receiver_id = $1 and 
          created_at between $2 and $3
        `,
          [userId, startDate, endDate],
        ),
      ]);
    return {
      totalDonations: totalDonations[0].total,
      totalSupporters: totalSupporters[0].total,
      totalValueLast30Days: totalValueLast30Days[0].total,
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .select('*')
      .execute();

    return user[0];
  }

  findByEmail(email: string): Promise<User> {
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  findByName(name: string): Promise<User> {
    return this.repository.findOne({
      where: {
        name,
      },
    });
  }

  async save(newData: User): Promise<void> {
    await this.repository.save(newData);
  }
}
