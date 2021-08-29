import express, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { httpStatusCode } from "../common.httpStatusCodes"

class BodyValidationMiddleware {
  verifyBodyFieldErrors(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          errors: errors.array()
        });
      }

      next();
    }
}

export default new BodyValidationMiddleware();