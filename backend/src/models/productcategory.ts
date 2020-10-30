import { Column, Table, BelongsTo, ForeignKey } from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import Product from "./product";
import Category from "./category";

@Table({
  tableName: "product_category",
  timestamps: true,
})
export default class ProductCategory extends BaseModel<ProductCategory> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "product_category_id",
  })
  productCategoryId: number;

  @Column({
    field: "product_id",
  })
  @ForeignKey(() => Product)
  productId: number;

  @BelongsTo(() => Product)
  products: Product[];

  @Column({
    field: "category_id",
  })
  @ForeignKey(() => Category)
  categoryId: number;

  @BelongsTo(() => Category)
  categories: Category[];

  @Column({
    field: "category_name",
  })
  categoryName: string;
}
