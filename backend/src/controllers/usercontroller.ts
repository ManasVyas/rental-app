import { NextFunction, Request, Response } from "express";
import { validateLogIn, validateUser } from "../utility/validation";
import { BaseController } from "../libs/basecontroller";
import User from "../models/user";
import { issueJWT, requireAuth } from "../utility/utility";

export class UserController extends BaseController {
  static USER_ALREADY_EXISTS_EXCEPTION_MSG = "User already exists!";

  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await User.getAllData(req.params.activeFlag === "1");
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async getData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await User.getData(req.params.userId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async addData(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateUser(req.body);
      if (error)
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      let data = await User.addData(req.body);
      if (data["error"] === "ALREADY_EXISTS") {
        res.status(400).json({
          data: [],
          status: BaseController.ERROR_STATUS,
          message: UserController.USER_ALREADY_EXISTS_EXCEPTION_MSG,
        });
      } else {
        const token = await issueJWT(data);
        data["token"] = token;
        res.json({ data, status: BaseController.SUCCESS_STATUS });
      }
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async logInUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateLogIn(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      }
      let data = await User.logInUser(req.body);
      if (
        data["error"] === "Invalid Password" ||
        data["error"] === "User doesn't exists"
      ) {
        return res.status(400).json({
          data: [],
          status: BaseController.ERROR_STATUS,
          error: "Invalid User",
        });
      } else {
        const token = await issueJWT(data);
        data["token"] = token;
        res.json({ data, status: BaseController.SUCCESS_STATUS });
      }
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async updateData(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateUser(req.body, false);
      if (error)
        return res.status(400).json({
          message: error.details[0].message,
          status: BaseController.ERROR_STATUS,
        });
      let data = await User.updateData(req.body);
      if (data["error"] === "ALREADY_EXISTS") {
        res.status(400).json({
          data: [],
          status: BaseController.ERROR_STATUS,
          message: UserController.USER_ALREADY_EXISTS_EXCEPTION_MSG,
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
      let data = await User.deleteData(req.params.userId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }

  async restoreData(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await User.restoreData(req.params.userId);
      res.json({ data, status: BaseController.SUCCESS_STATUS });
    } catch (e) {
      next({ status: BaseController.ERROR_STATUS, error: e });
    }
  }
}
