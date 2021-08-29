import { Request, Response, NextFunction } from "express";
import ordersService from "../service/orders.service";
import { httpStatusCode } from "../../common/common.httpStatusCodes";
import debug from "debug";

const log: debug.IDebugger = debug("app:orders-middleware");

class OrdersMiddleware {
  async validateExistentOrdersByBuyerCpf(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const buyerCpf = req.params.buyerCpf;
    const orders = await ordersService.getOrdersByBuyerCpf(buyerCpf);

    if (orders) {
      next();
    } else {
      res.status(httpStatusCode.NOT_FOUND).send({
        error: `Não foram encontradas compras para o CPF informado (${buyerCpf})`
      });
    }
  }
}

export default new OrdersMiddleware();