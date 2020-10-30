import { NextFunction, Request, Response } from "express";
import { validateCategory } from "../utility/validation";
import { BaseController } from "../libs/basecontroller";
import Category from "../models/category";

export class CategoryController extends BaseController {
  static CATEGORY_ALREADY_EXISTS_EXCEPTION_MSG = "Category already exists!";

  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Category.getAllData(req.params.activeFlag === "1");
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async getData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Category.getData(req.params.categoryId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async addData(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateCategory(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      }
      let data = await Category.addData(req.body);
      if (data["error"] === "ALREADY_EXISTS") {
        res.status(400).json({
          data: [],
          status: BaseController.ERROR_STATUS,
          message: CategoryController.CATEGORY_ALREADY_EXISTS_EXCEPTION_MSG,
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
      const { error } = validateCategory(req.body, false);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      }
      let data = await Category.updateData(req.body);
      if (data["error"] === "ALREADY_EXISTS") {
        res.status(400).json({
          data: [],
          status: BaseController.ERROR_STATUS,
          message: CategoryController.CATEGORY_ALREADY_EXISTS_EXCEPTION_MSG,
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
      let data = await Category.deleteData(req.params.categoryId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async restoreData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await Category.restoreData(req.params.categoryId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }
}
