import express, { Request, Response, NextFunction } from "express";
import debug from "debug";
import { httpStatusCode } from "../../common/common.httpStatusCodes";
import argon2d from "argon2";
import resellersService from "../service/resellers.service";

const log: debug.IDebugger = debug("app:resellers-middleware");

class ResellersMiddleware {
  async validateExistingReseller(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const cpf = req.body.cpf;
    const reseller = await resellersService.validateExistingReseller(cpf);

    if (reseller) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: `Revendedor com o CPF (${cpf}) já registrado.`
      });
    } else {
      next();
    }
  }

  async validateNotExistingReseller(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const resellerCpf = req.body.resellerCpf;
    const reseller = await resellersService.getResellerByCpf(resellerCpf);

    if (!reseller) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: `Não foi possível encontrar um revendedor para o CPF informado (${resellerCpf}).`
      });
    } else {
      next();
    }
  }

  async extractResellerCpfFromToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.resellerCpf = res.locals.jwt.cpf
    next();
  }

  async validateEmailAlreadyInUse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const reseller = await resellersService.validateEmailAlreadyInUse(req.body.email);

    if (reseller) {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: "Email já sendo utilizado por outro revendedor."
      });
    } else {
      next();
    }
  }
}

export default new ResellersMiddleware();