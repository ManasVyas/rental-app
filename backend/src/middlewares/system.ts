import { Request, Response, NextFunction } from "express";
import { BaseController } from "../libs/basecontroller";

export const AddUserId = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let userId = req.header("UserId");
  if (userId) {
    global["userId"] = userId;
    next();
  } else {
    next();
  }
};
