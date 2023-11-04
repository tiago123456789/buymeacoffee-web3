import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1697334235104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
            CREATE TABLE IF NOT EXISTS social_medias(
                id uuid PRIMARY KEY,
                user_id uuid NOT NULL,
                link varchar(250) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TABLE IF EXISTS social_medias
    `);
  }
}
