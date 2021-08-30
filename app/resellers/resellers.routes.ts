import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body } from "express-validator"
import bodyValidationMiddleware from "../common/middlewares/body-validation.middleware";
import resellersMiddleware from "./middleware/resellers.middleware";
import resellersController from "./controller/resellers.controller";
import jwtMiddleware from "../auth/middleware/jwt.middleware";

export class ResellersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ResellersRoutes")
  }

  configureRoutes() {
    this.app
      .route("/resellers")
      .post(
        body("name").isString(),
        body("cpf")
          .isString()
          .isLength({ min: 11, max: 11 })
          .withMessage("O CPF deve ser enviado sem characteres especiais"),
        body("email").isEmail(),
        body("password")
          .isLength( { min: 5 })
          .withMessage("A senha deve conter ao menos 5 caracteres"),
        bodyValidationMiddleware.verifyBodyFieldErrors,
        resellersMiddleware.validateExistingReseller,
        resellersMiddleware.validateEmailAlreadyInUse,
        resellersController.addReseller
      );

      return this.app;
  }
}