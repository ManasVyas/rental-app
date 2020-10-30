import { Router } from "express";
import { CategoryController } from "../controllers/categorycontroller";

export const CategoryRouter = Router();
let categoryController = new CategoryController();

CategoryRouter.get(
  "/all/:activeFlag",
  categoryController.setReqMethod("getAllData")
);
CategoryRouter.get("/:categoryId", categoryController.setReqMethod("getData"));
CategoryRouter.post("/add", categoryController.setReqMethod("addData"));
CategoryRouter.post("/update", categoryController.setReqMethod("updateData"));
CategoryRouter.delete(
  "/remove/:categoryId",
  categoryController.setReqMethod("deleteData")
);
CategoryRouter.post(
  "/activate/:categoryId",
  categoryController.setReqMethod("restoreData")
);
