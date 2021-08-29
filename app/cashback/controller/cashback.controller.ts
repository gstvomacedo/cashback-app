import axios from "axios";
import { Request, Response } from "express";
import { httpStatusCode } from "../../common/common.httpStatusCodes";

class CashbackController {
  async getTotalCashback(req: Request, res: Response) {
    const endpoint = `${process.env.CASHBACK_API_URL}/v1/cashback?cpf=${req.params.buyerCpf}`;
    const response = await axios.get(endpoint, {
      headers: {
        'token': String(process.env.CASHBACK_API_TOKEN)
      }
    });
    res.status(httpStatusCode.OK).send(
      response.data.body
    );
  }
}

export default new CashbackController();