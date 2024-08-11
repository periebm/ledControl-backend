import { Request, Response, NextFunction } from 'express';
import { ERoles } from '../types/ERoles';

const guardLevel =
  (niveisRota: ERoles[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!niveisRota || niveisRota.length === 0) {
        return res.status(401).send({ message: 'Invalid Access' });
      }

      if (!res.locals.roles || res.locals.roles.length === 0) {
        return res.status(401).send({ message: 'Invalid Access' });
      }

      const nivelValido = niveisRota.some((value: string) =>
        res.locals.roles.find((el: string) => el === value),
      );

      if (!nivelValido) {
        return res.status(401).send({ message: 'Invalid Access' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.sendStatus(400);
    }
  };

export { guardLevel };
