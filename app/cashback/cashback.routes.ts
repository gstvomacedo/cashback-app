import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import cashbackController from "./controller/cashback.controller";
import ordersMiddleware from "../orders/middleware/orders.middleware";

export class CashbackRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ChargebackRoutes")
  }

  configureRoutes() {
    this.app
      .get("/cashback/:buyerCpf", [
        ordersMiddleware.validateExistentOrdersByBuyerCpf,
        cashbackController.getTotalCashback
      ]);

      return this.app;
  }
}