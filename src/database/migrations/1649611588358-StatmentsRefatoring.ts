import {MigrationInterface, QueryRunner} from "typeorm";

export class StatmentsRefatoring1649611588358 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "statements" ADD COLUMN "sender_id" uuid REFERENCES users(id)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "statements" drop column "sender_id"`);
    }

}
