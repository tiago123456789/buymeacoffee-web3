import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1698532390412 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
            CREATE TABLE IF NOT EXISTS page_customizations(
              id uuid PRIMARY KEY,
              image_background varchar(255) NOT NULL,
              enable_total_supporters boolean DEFAULT false,
              theme_color varchar(70) DEFAULT 'black',
              what_are_you_doing varchar(150),
              featured_video varchar(255),
              description text,
              user_id uuid NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id)
          )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP TABLE IF EXISTS users;
    `);
  }
}
