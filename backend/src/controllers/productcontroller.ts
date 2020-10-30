import { NextFunction, Request, Response } from "express";
import { validateProduct } from "../utility/validation";
import { BaseController } from "../libs/basecontroller";
import Product from "../models/product";

export class ProductController extends BaseController {
  static PRODUCT_ALREADY_EXISTS_EXCEPTION_MSG = "Product already exists!";

  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Product.getAllData(req.params.activeFlag === "1");
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async getData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Product.getData(req.params.productId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async addData(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateProduct(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      }
      let data = await Product.addData(req.body);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async updateData(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateProduct(req.body, false);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      }
      let data = await Product.updateData(req.body);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async deleteData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Product.deleteData(req.params.productId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async restoreData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Product.restoreData(req.params.productId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }
}
