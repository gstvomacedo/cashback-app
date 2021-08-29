import express, { Request, Response } from "express";
import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from "./common/common.routes.config";
import debug from "debug";
import { httpStatusCode } from "./common/common.httpStatusCodes";
import { ResellersRoutes } from "./resellers/resellers.routes";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new ResellersRoutes(app));

const serverStartedMessage = `Node server started at http://localhost:${port}`;
app.get('/', (req: Request, res: Response) => {
  res.status(httpStatusCode.OK).send(serverStartedMessage);
})

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName}`);
  });

  console.log(serverStartedMessage);
});
