import { MigrationInterface, QueryRunner } from "typeorm";

export class createNodeEntity1670095159404 implements MigrationInterface {
    name = 'createNodeEntity1670095159404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nodes" ("id" varchar PRIMARY KEY NOT NULL, "public_key" text NOT NULL, "type" text NOT NULL, "name" text NOT NULL, "nickname" text NOT NULL, "icon" text NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "nodes"`);
    }

}
