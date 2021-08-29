import debug from "debug";
import express, { Request, Response } from "express";
import { httpStatusCode } from "../../common/common.httpStatusCodes";
import ordersService from "../service/orders.service";
import resellersController from "../../resellers/controller/resellers.controller";

const log: debug.IDebugger = debug("app:orders-controller");

class OrdersController {
  async addOrder(req: Request, res: Response) {
    try {
      const order = await ordersService.create(req.body);

      if (order) {
        res.status(httpStatusCode.CREATED).send();
      } else {
        res.status(httpStatusCode.BAD_REQUEST).send({
          error: "Não foi possível registrar a compra"
        });
      }
    } catch (err) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: `Ocorreu um erro. ${err}`
      });
    }
  }
}

export default new OrdersController();