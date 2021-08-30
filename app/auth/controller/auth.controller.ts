import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import debug from "debug";
import { httpStatusCode } from "../../common/common.httpStatusCodes";

const log: debug.IDebugger = debug("app:auth-controller");

class AuthController { 
  async createJwt(req: Request, res: Response) {
    try {
      const jwtSecret = String(process.env.JWT_SECRET);
      const jwtTokenExpirationInSeconds = 36000;

      const refreshId = req.body.resellerId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');

      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: jwtTokenExpirationInSeconds
      });

      return res.status(httpStatusCode.CREATED).send({
        accessToken: token, refreshToken: hash
      });
    } catch (err) {
      log("Erro while trying to generate jwt token", err);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send();
    }
  }
}

export default new AuthController();