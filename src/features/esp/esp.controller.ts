import { NextFunction, Request, Response } from 'express';
import espRepository from '../../repositories/espCheck.repository';
import { EspService } from './Esp.service';

class EspController {
  async checkHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const espService = new EspService(espRepository);

      const response = await espService.checkHealth();
      return res.send(response);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

const espController = new EspController();

export default espController;
