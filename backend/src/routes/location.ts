import { Router } from "express";
import { LocationController } from "../controllers/locationcontroller";

export const LocationRouter = Router();
let locationController = new LocationController();

LocationRouter.get(
  "/all/:activeFlag",
  locationController.setReqMethod("getAllData")
);
LocationRouter.get("/:locationId", locationController.setReqMethod("getData"));
LocationRouter.post("/add", locationController.setReqMethod("addData"));
LocationRouter.post("/update", locationController.setReqMethod("updateData"));
LocationRouter.delete(
  "/remove/:locationId",
  locationController.setReqMethod("deleteData")
);
LocationRouter.post(
  "/activate/:locationId",
  locationController.setReqMethod("restoreData")
);
