import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

const configService = new ConfigService();

let options;

if (process.env.NODE_ENV === 'testing') {
  config({ path: '.env.testing' });
  options = {
    type: 'cockroachdb',
    url: configService.get('DB_URL'),
    entities: [__dirname + '/../**/*.entity.js'],
    migrationsTableName: 'migration',
    migrations: [__dirname + '/src/migrations/*.ts'],
    ssl: true,
  };
} else {
  config();
  options = {
    type: 'postgres',
    url: configService.get('DB_URL'),
    entities: [__dirname + '/../**/*.entity.js'],
    migrationsTableName: 'migration',
    migrations: [__dirname + '/src/migrations/*.ts'],
    ssl: true,
  };
}

export default new DataSource(options);
