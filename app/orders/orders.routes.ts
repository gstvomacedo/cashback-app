import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body, param } from "express-validator";
import ordersController from "./controller/orders.controller";
import bodyValidationMiddleware from "../common/middlewares/body-validation.middleware";
import resellersMiddleware from "../resellers/middleware/resellers.middleware";

export class OrdersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "OrdersRoutes")
  }

  configureRoutes() {
    this.app
      .route("/orders")
      .post(
        body("buyerEmail").isEmail(),
        body("resellerCpf").isString(),
        body("price").isNumeric(),
        bodyValidationMiddleware.verifyBodyFieldErrors,
        resellersMiddleware.validateNotExistingReseller,
        ordersController.addOrder
      );

    this.app
      .get("/orders", [
      ordersController.listOrders
      ]);

    this.app
      .get("/orders/:orderId", [
        param("userId")
          .isString(),
        ordersController.getOrderById
      ]);

    return this.app;
  }
}

