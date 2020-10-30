import { Op } from "sequelize";
import { Column, HasMany, Table } from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import Product from "./product";
import ProductCategory from "./productcategory";

@Table({
  tableName: "category",
  timestamps: true,
})
export default class Category extends BaseModel<Category> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "category_id",
  })
  categoryId: number;

  @Column({
    allowNull: false,
    field: "name",
  })
  name: string;

  @HasMany(() => ProductCategory)
  productCategories: ProductCategory[];

  static async _exists(data: any) {
    const where = {
      name: { [Op.iLike]: data.name },
    };
    return Category.findOne({
      where,
      attributes: ["categoryId", "name"],
    });
  }

  static async getAllData(deleteResult: Boolean = false) {
    const where = deleteResult
      ? { deleteFlag: BaseModel.ACTIVE_DELETE_FLAG }
      : { deleteFlag: BaseModel.INACTIVE_DELETE_FLAG };

    return Category.findAll({
      attributes: ["categoryId", "name", "deleteFlag"],
      where,
      order: [["categoryId", "DESC"]],
    });
  }

  static async getData(categoryId: string) {
    return Category.findByPk(categoryId, {
      attributes: ["categoryId", "name", "deleteFlag"],
    });
  }

  static async addData(data: any) {
    const categoryExists = await this._exists(data);

    if (categoryExists) {
      return { error: "ALREADY_EXISTS" };
    }

    data.createdBy = global["userId"];
    data.updatedBy = global["userId"];

    let category = new Category(data);
    return category.save();
  }

  static async updateData(data: any) {
    const categoryExists = await this._exists(data);

    if (categoryExists) {
      return { error: "ALREADY_EXISTS" };
    }
    data.updatedBy = global["userId"];

    const result = await Category.update(data, {
      returning: true,
      where: { categoryId: data.categoryId },
    });
    return BaseModel.checkUpdate(result);
  }

  static async deleteData(categoryId: string) {
    const result = await Category.update(
      {
        deleteFlag: BaseModel.INACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },
      { where: { categoryId } }
    );
    return result[0] && result[0] > 0;
  }

  static async restoreData(categoryId: string) {
    const result = await Category.update(
      {
        deleteFlag: BaseModel.ACTIVE_DELETE_FLAG,
        updatedBy: global["userId"],
      },

      { where: { categoryId } }
    );
    return result[0] && result[0] > 0;
  }
}
