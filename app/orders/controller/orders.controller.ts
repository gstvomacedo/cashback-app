import debug from "debug";
import express, { Request, Response } from "express";
import { httpStatusCode } from "../../common/common.httpStatusCodes";
import ordersService from "../service/orders.service";

const log: debug.IDebugger = debug("app:orders-controller");

class OrdersController {
  async addOrder(req: Request, res: Response) {
    try {
      const createdOrder = await ordersService.create(req.body);

      if (createdOrder) {
        res.status(httpStatusCode.CREATED).send(createdOrder);
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

  async listOrders(req: Request, res: Response) {
    try {
      const orders = await ordersService.listOrders();
      res.status(httpStatusCode.OK).send(orders);
    } catch (err) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: `Ocorreu um erro. ${err}`
      });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const order = await ordersService.getOrderById(orderId);

      if (order) {
        res.status(httpStatusCode.OK).send(order);
      } else {
        res.status(httpStatusCode.NOT_FOUND).send({
          error: `Não foi possível encontrar uma compra com o ID: ${orderId}.`
        })
      }
    } catch (err) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: `Ocorreu um erro. ${err}`
      });
    }
  }
}

export default new OrdersController();