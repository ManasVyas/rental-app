import { NextFunction, Request, Response } from "express";
import { BaseController } from "../libs/basecontroller";
import { validateLocation } from "../utility/validation";
import Location from "../models/location";

export class LocationController extends BaseController {
  static LOCATION_ALREADY_EXISTS_EXCEPTION_MSG = "Location already exists!";

  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Location.getAllData(req.params.activeFlag === "1");
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async getData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Location.getData(req.params.locationId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async addData(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateLocation(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      }
      let data = await Location.addData(req.body);
      if (data["error"] === "ALREADY_EXISTS") {
        res.status(400).json({
          data: [],
          status: BaseController.ERROR_STATUS,
          message: LocationController.LOCATION_ALREADY_EXISTS_EXCEPTION_MSG,
        });
      } else {
        res.json({ data, status: BaseController.SUCCESS_STATUS });
      }
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async updateData(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateLocation(req.body, false);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      }
      let data = await Location.updateData(req.body);
      if (data["error"] === "ALREADY_EXISTS") {
        res.status(400).json({
          data: [],
          status: BaseController.ERROR_STATUS,
          message: LocationController.LOCATION_ALREADY_EXISTS_EXCEPTION_MSG,
        });
      } else {
        res.json({ data, status: BaseController.SUCCESS_STATUS });
      }
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async deleteData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Location.deleteData(req.params.locationId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async restoreData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Location.restoreData(req.params.locationId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }
}
