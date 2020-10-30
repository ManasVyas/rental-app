import { Router } from "express";
import { OrderController } from "../controllers/ordercontroller";

export const OrderRouter = Router();
let orderController = new OrderController();

OrderRouter.get("/all/:activeFlag", orderController.setReqMethod("getAllData"));
OrderRouter.get("/:orderId", orderController.setReqMethod("getData"));
OrderRouter.post("/add", orderController.setReqMethod("addData"));
OrderRouter.post("/update", orderController.setReqMethod("updateData"));
OrderRouter.delete(
  "/remove/:orderId",
  orderController.setReqMethod("deleteData")
);
OrderRouter.post(
  "/activate/:orderId",
  orderController.setReqMethod("restoreData")
);
