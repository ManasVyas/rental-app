import { Router } from "express";
import { UserController } from "../controllers/usercontroller";

export const UserRouter = Router();
let userController = new UserController();

UserRouter.get("/all/:activeFlag", userController.setReqMethod("getAllData"));
UserRouter.get("/:userId", userController.setReqMethod("getData"));
UserRouter.post("/add", userController.setReqMethod("addData"));
UserRouter.post("/login", userController.setReqMethod("logInUser"));
UserRouter.post("/update", userController.setReqMethod("updateData"));
UserRouter.delete("/remove/:userId", userController.setReqMethod("deleteData"));
UserRouter.post(
  "/activate/:userId",
  userController.setReqMethod("restoreData")
);
