import { CommonRoutesConfig } from "../common/common.routes.config";
import authController from "./controller/auth.controller";
import authMiddleware from "./middleware/auth.middleware";
import express, { Request, Response } from "express";
import bodyValidationMiddleware from "../common/middlewares/body-validation.middleware";
import { body } from "express-validator";
import jwtMiddleware from "./middleware/jwt.middleware";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): express.Application {
    this.app.post("/auth", [
      body("email").isEmail(),
      body("password").isString(),
      bodyValidationMiddleware.verifyBodyFieldErrors,
      authMiddleware.validatePassword,
      authController.createJwt,
    ]);

    this.app.post("/auth/refresh-token", [
      jwtMiddleware.validJwtNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJwt
    ]);

    return this.app;
  }
}