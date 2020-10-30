import { Router } from "express";
import { ProductController } from "../controllers/productcontroller";

export const ProductRouter = Router();
let productController = new ProductController();

ProductRouter.get(
  "/all/:activeFlag",
  productController.setReqMethod("getAllData")
);
ProductRouter.get("/:productId", productController.setReqMethod("getData"));
ProductRouter.post("/add", productController.setReqMethod("addData"));
ProductRouter.post("/update", productController.setReqMethod("updateData"));
ProductRouter.delete(
  "/remove/:productId",
  productController.setReqMethod("deleteData")
);
ProductRouter.post(
  "/activate/:productId",
  productController.setReqMethod("restoreData")
);
