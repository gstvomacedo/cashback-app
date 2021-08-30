import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body, param } from "express-validator";
import ordersController from "./controller/orders.controller";
import bodyValidationMiddleware from "../common/middlewares/body-validation.middleware";
import resellersMiddleware from "../resellers/middleware/resellers.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";

export class OrdersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "OrdersRoutes")
  }

  configureRoutes() {
    this.app
      .route("/orders")
      .post(
        body("buyerEmail").isEmail(),
        body("price").isNumeric(),
        body("buyerCpf")
        .isString()
        .isLength({ min: 11, max: 11 })
        .withMessage("O CPF deve ser enviado sem characteres especiais"),
        jwtMiddleware.validJwtNeeded,
        bodyValidationMiddleware.verifyBodyFieldErrors,
        resellersMiddleware.extractResellerCpfFromToken,
        ordersController.addOrder
      );

    this.app
      .get("/orders", [
        jwtMiddleware.validJwtNeeded,
        ordersController.listOrders
      ]);

    this.app
      .get("/orders/:orderId", [
        param("orderId")
          .isString(),
        jwtMiddleware.validJwtNeeded,
        ordersController.getOrderById
      ]);

    return this.app;
  }
}

