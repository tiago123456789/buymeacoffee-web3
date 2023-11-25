import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

const configService = new ConfigService();

let options;

if (process.env.NODE_ENV === 'testing') {
  config({ path: '.env.testing' });
  options = {
    type: 'postgres',
    url: configService.get('DB_URL'),
    entities: [__dirname + '/../**/*.entity.js'],
    migrationsTableName: 'migration',
    migrations: [__dirname + '/src/migrations/*.ts'],
  };
} else {
  config();
  options = {
    type: 'postgres',
    url: configService.get('DB_URL'),
    entities: [__dirname + '/../**/*.entity.js'],
    migrationsTableName: 'migration',
    migrations: [__dirname + '/src/migrations/*.ts'],
  };
}

export default new DataSource(options);
