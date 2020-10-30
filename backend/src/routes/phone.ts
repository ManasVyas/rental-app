import { Router } from "express";
import { PhoneController } from "../controllers/phonecontroller";

export const PhoneRouter = Router();
let phoneController = new PhoneController();

PhoneRouter.get("/all/:activeFlag", phoneController.setReqMethod("getAllData"));
PhoneRouter.get("/:phoneId", phoneController.setReqMethod("getData"));
PhoneRouter.post("/add", phoneController.setReqMethod("addData"));
PhoneRouter.post("/update", phoneController.setReqMethod("updateData"));
PhoneRouter.delete(
  "/remove/:phoneId",
  phoneController.setReqMethod("deleteData")
);
PhoneRouter.post(
  "/activate/:phoneId",
  phoneController.setReqMethod("restoreData")
);
