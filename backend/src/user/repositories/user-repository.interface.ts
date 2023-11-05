import { DashboardMetricDto } from '../dtos/dashboard-metric.dto';

export interface UserRepositoryInterface<T> {
  findById(id: string): Promise<T>;
  findByEmail(email: string): Promise<T>;
  findByName(name: string): Promise<T>;
  save(newData: T): Promise<void>;
  getMetricsByUserId(userId: string): Promise<DashboardMetricDto>;
}
