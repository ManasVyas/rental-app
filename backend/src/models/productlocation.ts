import { Column, Table, BelongsTo, ForeignKey } from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import Product from "./product";
import Location from "./location";

@Table({
  tableName: "product_location",
  timestamps: true,
})
export default class ProductLocation extends BaseModel<ProductLocation> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "product_location_id",
  })
  productLocationId: number;

  @Column({
    field: "product_id",
  })
  @ForeignKey(() => Product)
  productId: number;

  @BelongsTo(() => Product)
  products: Product[];

  @Column({
    field: "location_id",
  })
  @ForeignKey(() => Location)
  locationId: number;

  @BelongsTo(() => Location)
  locations: Location[];

  @Column({
    field: "location_name",
  })
  locationName: string;
}
