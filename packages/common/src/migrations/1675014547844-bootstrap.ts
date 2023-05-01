import { MigrationInterface, QueryRunner } from 'typeorm';

export class bootstrap1675014547844 implements MigrationInterface {
  name = 'bootstrap1675014547844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "users" ("id" varchar PRIMARY KEY NOT NULL, "username" text NOT NULL, "password" text NOT NULL, "role" text NOT NULL)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
