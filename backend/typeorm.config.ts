import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'testing') {
  config({ path: '.env.testing' });
} else {
  config();
}

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  url: configService.get('DB_URL'),
  entities: [__dirname + '/../**/*.entity.js'],
  migrationsTableName: 'migration',
  migrations: [__dirname + '/src/migrations/*.ts'],
});
