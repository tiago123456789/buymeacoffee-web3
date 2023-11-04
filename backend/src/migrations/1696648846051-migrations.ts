import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1696648846051 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users(
                id uuid PRIMARY KEY,
                name VARCHAR(70) NOT NULL,
                slug VARCHAR(70) NOT NULL,
                email VARCHAR(150) NOT NULL,
                password VARCHAR(255) NOT NULL,
                image VARCHAR(255),
                wallet_address VARCHAR(255)
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TABLE IF EXISTS users
    `);
  }
}
