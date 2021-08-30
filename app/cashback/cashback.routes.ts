import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import cashbackController from "./controller/cashback.controller";
import ordersMiddleware from "../orders/middleware/orders.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";

export class CashbackRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "CashbackRoutes")
  }

  configureRoutes() {
    this.app
      .get("/cashback/:buyerCpf", [
        jwtMiddleware.validJwtNeeded,
        ordersMiddleware.validateExistentOrdersByBuyerCpf,
        cashbackController.getTotalCashback
      ]);

      return this.app;
  }
}