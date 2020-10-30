import {
  Errback,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { BaseController } from "../libs/basecontroller";
import Exception from "../models/exception";

export function ErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.pathURL = req.path || "";
  err.stackTrace = Error().stack || "";
  Exception.addException(err);
  res.status(500);
  if (err.name === "SequelizeDatabaseError") {
    res.json({
      errors: [
        {
          attribute: "SequelizeDatabaseError",
          message: err.toString(),
          sql: err,
        },
      ],
      status: BaseController.ERROR_STATUS,
    });
  } else {
    if (err.attribute || !err.error) {
      res.json({ errors: err, status: BaseController.ERROR_STATUS });
    } else {
      res.json({
        errors: err.error.toString(),
        status: BaseController.ERROR_STATUS,
      });
    }
  }
}
