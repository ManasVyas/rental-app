export class BaseController {
  static SUCCESS_STATUS = "success";
  static ERROR_STATUS = "error";

  setReqMethod(methodName: string): any {
    if (typeof this[methodName] != "undefined") {
      return this[methodName].bind(this);
    } else {
      throw `Invalid ${methodName} Method name provided, please check your controller`;
    }
  }
}
