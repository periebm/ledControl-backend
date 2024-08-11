import { NextFunction, Response, Request } from 'express';
import { AppError } from '../errors/AppError';
import { HttpStatusCode } from 'axios';
import Winston from '../infra/logger/Winston';
import { ILogger } from '../infra/ILogger';

class ErrorHandler {
  async handleError(err: any, req: Request, res: Response, next: NextFunction) {
    const logger: ILogger = new Winston();
    if (err instanceof AppError) {
      const responseError = {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
      };

      logger.error(err);
      return res.status(err.statusCode).send(responseError);
    }

    return res.status(HttpStatusCode.BadRequest).send({
      success: false,
      statusCode: HttpStatusCode.BadRequest,
      message: 'Bad Request',
    });
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;