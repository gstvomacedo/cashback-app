import { Request, Response, NextFunction} from "express";
import resellersService from "../../resellers/service/resellers.service";
import argon2d from "argon2";
import { httpStatusCode } from "../../common/common.httpStatusCodes";

class AuthMiddleware {
  async validatePassword(
    req: Request,
      res: Response,
      next: NextFunction
    ) {
      const reseller: any = await resellersService.getResellerWithPasswordHashByEmail(req.body.email);

      if (reseller) {
        if (await argon2d.verify(reseller.password, req.body.password)) {
          req.body = {
            resellerId: reseller._id,
            email: reseller.email,
            cpf: reseller.cpf,
          };

          return next();;
        }
      }

      res.status(httpStatusCode.BAD_REQUEST).send({
        error: "Email ou senha inválido"
      });
    }
}

export default new AuthMiddleware();