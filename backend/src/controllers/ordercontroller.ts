import { NextFunction, Request, Response } from "express";
import { validateOrder } from "../utility/validation";
import { BaseController } from "../libs/basecontroller";
import Order from "../models/order";

export class OrderController extends BaseController {
  static ORDER_ALREADY_EXISTS_EXCEPTION_MSG = "Order already exists!";

  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Order.getAllData(req.params.activeFlag === "1");
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async getData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Order.getData(req.params.orderId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async addData(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateOrder(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      }
      let data = await Order.addData(req.body);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async updateData(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateOrder(req.body, false);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      }
      let data = await Order.updateData(req.body);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ error: e, status: BaseController.ERROR_STATUS });
    }
  }

  async deleteData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Order.deleteData(req.params.orderId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ error: e, status: BaseController.ERROR_STATUS });
    }
  }

  async restoreData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Order.restoreData(req.params.orderId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ error: e, status: BaseController.ERROR_STATUS });
    }
  }
}
