import { MigrationInterface, QueryRunner } from "typeorm";

export class bootstrap1675014547844 implements MigrationInterface {
    name = 'bootstrap1675014547844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "value" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "node_channels" ("id" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "channel" integer NOT NULL, "node_id" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "nodes" ("id" varchar PRIMARY KEY NOT NULL, "public_key" text NOT NULL, "type" text NOT NULL, "name" text NOT NULL, "nickname" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "user_id" varchar NOT NULL, "instance_public_key" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_node_channels" ("id" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "channel" integer NOT NULL, "node_id" varchar NOT NULL, CONSTRAINT "FK_dfc2f20e73157717efea94ecbe2" FOREIGN KEY ("node_id") REFERENCES "nodes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_node_channels"("id", "name", "channel", "node_id") SELECT "id", "name", "channel", "node_id" FROM "node_channels"`);
        await queryRunner.query(`DROP TABLE "node_channels"`);
        await queryRunner.query(`ALTER TABLE "temporary_node_channels" RENAME TO "node_channels"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "node_channels" RENAME TO "temporary_node_channels"`);
        await queryRunner.query(`CREATE TABLE "node_channels" ("id" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "channel" integer NOT NULL, "node_id" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "node_channels"("id", "name", "channel", "node_id") SELECT "id", "name", "channel", "node_id" FROM "temporary_node_channels"`);
        await queryRunner.query(`DROP TABLE "temporary_node_channels"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "nodes"`);
        await queryRunner.query(`DROP TABLE "node_channels"`);
        await queryRunner.query(`DROP TABLE "config"`);
    }

}
