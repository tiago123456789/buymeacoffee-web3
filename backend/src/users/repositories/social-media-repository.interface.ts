export interface SocialMediaRepositoryInterface<T> {
  save(newData: T): Promise<void>;
}
