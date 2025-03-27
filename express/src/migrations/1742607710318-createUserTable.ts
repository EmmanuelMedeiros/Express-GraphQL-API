import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1742607710318 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
                await queryRunner.createTable(
                    new Table({
                        name: "users",
                        columns: [
                            {
                                name: "uuid",
                                type: "uuid",
                                isPrimary: true,
                                default: "uuid_generate_v4()",
                            }
                        ]
                    }),
                    true
                );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }

}
