import express, { Request, Response, NextFunction } from "express";
import resellerService from "../service/reseller.service";
import debug from "debug";
import { httpStatusCode } from "../../common/common.httpStatusCodes";
import argon2d from "argon2";

const log: debug.IDebugger = debug("app:resellers-middleware");

class ResellersMiddleware {
  async validateExistingReseller(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const cpf = req.body.cpf;
    const reseller = await resellerService.validateExistingReseller(cpf);

    if (reseller) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: `Revendedor com o CPF (${cpf}) já registrado.`
      });
    } else {
      next();
    }
  }

  async validateEmailAlreadyInUse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const reseller = await resellerService.validateEmailAlreadyInUse(req.body.email);

    if (reseller) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: "Email já sendo utilizado por outro revendedor."
      });
    } else {
      next();
    }
  }

  async validateLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    log("fdgefrerferg");
    const passwordHash = await resellerService.getPasswordHashByEmail(req.body.email);
    log(passwordHash);

    if (passwordHash === null) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: "Não foi possível encontrar o usuário para o email informado."
      });
    }
    const passwordMatchesWithHash = await argon2d.verify(String(passwordHash), req.body.password)

    if (passwordMatchesWithHash) {
      next();
    } else {
      res.status(httpStatusCode.BAD_REQUEST).send({
        erro: "Senha inválida"
      });
    }
  }
}

export default new ResellersMiddleware();