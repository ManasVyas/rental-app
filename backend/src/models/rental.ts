import { Column, ForeignKey, BelongsTo, Table } from "sequelize-typescript";
import { BaseModel } from "../libs/basemodel";
import Order from "./order";
import Product from "./product";

@Table({
  tableName: "rental",
  timestamps: true,
})
export default class Rental extends BaseModel<Rental> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    field: "rental_id",
  })
  rentalId: number;

  @Column({
    allowNull: false,
    field: "date_out",
  })
  dateOut: Date;

  @Column({
    allowNull: false,
    field: "date_returned",
  })
  dateReturned: Date;

  @Column({
    allowNull: false,
    field: "rental_days",
  })
  rentalDays: number;

  @Column({
    allowNull: false,
    field: "daily_rental_rate",
  })
  dailyRentalRate: number;

  @Column({
    allowNull: false,
    field: "total_rental_rate",
  })
  totalRentalRate: number;

  @Column({
    field: "product_id",
  })
  @ForeignKey(() => Product)
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @Column({
    field: "order_id",
  })
  @ForeignKey(() => Order)
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;
}
