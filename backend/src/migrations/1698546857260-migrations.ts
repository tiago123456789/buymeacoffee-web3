import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1698546857260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
                CREATE TABLE IF NOT EXISTS donations(
                  id uuid PRIMARY KEY,
                  receiver_id uuid NOT NULL,
                  donator_address varchar(255) NOT NULL,
                  message varchar(255),
                  value decimal(10,5) NOT NULL,
                  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
                  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (receiver_id) REFERENCES users(id)
              )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
            DROP TABLE IF EXISTS donations;
        `);
  }
}
