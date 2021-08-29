import argon2d from "argon2";
import debug from "debug";
import express, { Request, Response } from "express";
import { httpStatusCode } from "../../common/common.httpStatusCodes";
import resellersService from "../service/resellers.service";

const log: debug.IDebugger = debug("app:resellers-controller");

class ResellersController {
  async addReseller(req: Request, res: Response) {
    try {
      const pendingToCreateReseller = req.body;
      pendingToCreateReseller.password = await argon2d.hash(pendingToCreateReseller.password);

      const resellerId = await resellersService.create(pendingToCreateReseller);
      res.status(httpStatusCode.OK).send({
        resellerId
      });
    } catch (err) {
     res.status(httpStatusCode.BAD_REQUEST).send({
       error: `Ocorreu um erro. ${err}`
     });
    }
  }

  async loginReseller(req: Request, res: Response) {
    try {
      const loggedResellerInfo = await resellersService.getResellerByEmail(req.body.email);

      if (loggedResellerInfo) {
        res.status(httpStatusCode.OK).send(loggedResellerInfo);
      } else {
        res.status(httpStatusCode.UNAUTHORIZED).send({
          error: "Não foi possível encontrar o usuário para o email informado."
        })
      }
    } catch (err) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: `Ocorreu um erro .${err}`
      });
    }
  }
}

export default new ResellersController();