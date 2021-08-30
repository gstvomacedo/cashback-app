import { Request, Response, NextFunction} from "express";
import { httpStatusCode } from "../../common/common.httpStatusCodes";
import jwt from "jsonwebtoken";
import resellersService from "../../resellers/service/resellers.service";
import crypto from "crypto";
import { Jwt } from "../../common/types/jwt.type";


class JwtMiddleware {
  verifyRefreshBodyField(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.body && req.body.refreshToken) {
      next();
    } else {
      res.status(httpStatusCode.BAD_REQUEST).send({
        error: "Campo refreshToken não informado."
      })
    }
  }

  async validRefreshNeeded(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const reseller: any = await resellersService.getResellerWithPasswordHashByEmail(res.locals.jwt.email);
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    );
    const jwtSecret = String(process.env.JWT_SECRET);
    const hash = crypto
      .createHmac("sha512", salt)
      .update(res.locals.jwt.resellerId + jwtSecret)
      .digest("base64");

    if (hash === req.body.refreshToken) {
      req.body = {
        resellerId: reseller._id,
        email: reseller.email,
        cpf: reseller.cpf,
      };

      return next();
    } else {
      return res.status(httpStatusCode.BAD_REQUEST).send({
        error: "Refresh token inválido"
      });
    }
  }

  async validJwtNeeded(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.headers["authorization"]) {
      try {
        const jwtSecret = String(process.env.JWT_SECRET);
        const authorization = req.headers["authorization"].split(" ");
        
        if (authorization[0] !== "Bearer") {
          return res.status(httpStatusCode.UNAUTHORIZED).send();
        } else {
          res.locals.jwt = jwt.verify(
            authorization[1],
            jwtSecret
          ) as Jwt;
          
          next();
        }
      } catch (err) {
        return res.status(httpStatusCode.BAD_REQUEST).send(err);
      }
    } else {
      return res.status(httpStatusCode.UNAUTHORIZED).send();
    }
  }
}

export default new JwtMiddleware();