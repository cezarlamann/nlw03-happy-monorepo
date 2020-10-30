import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createImages1603038940725 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "images",
      columns: [
        {
          name: "id",
          type: "integer",
          unsigned: true,
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "path",
          type: "varchar",
          isNullable: false
        },
        {
          name: "orphanage_id",
          type: "integer",
          isNullable: false
        }
      ],
      foreignKeys:[
        {
          name: "fk_image_orphanage",
          columnNames: [
            "orphanage_id"
          ],
          referencedTableName: "orphanages",
          referencedColumnNames: [
            "id"
          ],
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("images");
  }

}
