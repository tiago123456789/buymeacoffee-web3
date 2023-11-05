export interface PageCustomizedRepositoryInterface<T> {
  findByUserId(userId: string): Promise<T>;
  save(newData: T): Promise<void>;
}
