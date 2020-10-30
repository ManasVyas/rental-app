import { NextFunction, Request, Response } from "express";
import { validatePhone } from "../utility/validation";
import { BaseController } from "../libs/basecontroller";
import Phone from "../models/phone";
import { PhoneType } from "../utility/types";

export class PhoneController extends BaseController {

  static PHONE_ALREADY_EXISTS_EXCEPTION_MSG = "Phone already exists!";

  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Phone.getAllData(req.params.activeFlag === "1");
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async getData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Phone.getData(req.params.phoneId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async addData(req: Request<{}, {}, PhoneType>, res: Response, next: NextFunction) {
    try {
      // if(typeof req.body !== 'PhoneType') {

      // }
      let data = await Phone.addData(req.body);
      console.log("req.body", req.body);
      const { error } = validatePhone(req.body);
      if (error)
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      // let data = await Phone.addData(req.body);
      if (data["error"] === "ALREADY_EXISTS") {
        res.status(400).json({
          data: [],
          status: BaseController.ERROR_STATUS,
          message: PhoneController.PHONE_ALREADY_EXISTS_EXCEPTION_MSG,
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
      const { error } = validatePhone(req.body, false);
      console.log("error", error);
      if (error)
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      let data = await Phone.updateData(req.body);
      if (data["error"] === "ALREADY_EXISTS") {
        res.status(400).json({
          data: [],
          status: BaseController.ERROR_STATUS,
          message: PhoneController.PHONE_ALREADY_EXISTS_EXCEPTION_MSG,
        });
      } else {
        res.json({ data, status: BaseController.SUCCESS_STATUS });
      }
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS });
    }
  }

  async deleteData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Phone.deleteData(req.params.phoneId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS });
    }
  }

  async restoreData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Phone.restoreData(req.params.phoneId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS });
    }
  }
}
