import express from 'express';
import './config/config';
import cors from 'cors';
import helmet from 'helmet';
import { setupRoutes } from './config/routes';
import { envConfig } from './config/config';
import errorHandler from './middlewares/error.handler';
import cookieParser from 'cookie-parser';
import limiter from './middlewares/rateLimiter.middleware';
import Winston from './infra/logger/Winston';
import { ILogger } from './infra/ILogger';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(cookieParser());

setupRoutes(app);
app.use(errorHandler.handleError);

const PORT = envConfig.port || 3001;

app.listen(PORT, () => {
  console.log(`GardenAPI: Up and Running in [${envConfig.env}] mode on port [${PORT}]`);
});

process.on('uncaughtException', (err) => {
  const logger: ILogger = new Winston();
  logger.error('UncaughtException');
  logger.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  const logger: ILogger = new Winston();
  logger.error('UnhandledRejection');
  if (reason) logger.error(reason);
  process.exit(1);
});