import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envConfig } from '../config/config';
import { HttpStatusCode } from 'axios';

const SECRET_KEY = envConfig.jwt_secret;

class AuthorizationMiddleware {
  constructor() {
    this.jwtValidator = this.jwtValidator.bind(this); // Bind the context of this
    /*
    The jwtValidator method may be called in a way that the context of this is not preserved,
    especially when used as middleware in a framework like Express. Express calls middlewares
    with its own context, which can cause this inside the middleware to not be what you expect.
    To resolve the issue in the first code, you can ensure that the jwtValidator method is always
     called with the correct context, bound to the class instance. Here’s one way to do this using
     explicit binding in the constructor.
    */
  }

  private validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (typeof decoded === 'string') {
        return { decoded: null, err: new Error('Wrong decoded Format.') };
      }
      return { decoded, err: null };
    } catch (err) {
      return { decoded: null, err };
    }
  }

  public jwtValidator(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken && !refreshToken) {
      return res.status(HttpStatusCode.Unauthorized).send({
        success: false,
        statusCode: HttpStatusCode.Unauthorized,
        message: 'Unauthorized.',
      });
    }

    try {
      if (accessToken) {
        const token = jwt.verify(accessToken, SECRET_KEY) as JwtPayload;
        if (!token.user) throw new Error();

        res.locals.user = token.user;
        return next();
      }
    } catch (error) {
      if (!refreshToken) {
        return res.status(HttpStatusCode.Unauthorized).send({
          success: false,
          statusCode: HttpStatusCode.Unauthorized,
          message: 'Unauthorized. Refresh Token',
        });
      }

      try {
        const token = jwt.verify(refreshToken, SECRET_KEY) as JwtPayload;
        if (!token.user) throw new Error();

        const newAccessToken = jwt.sign({ user: token.user }, SECRET_KEY, {
          expiresIn: '1h',
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
        });
        console.log('New Access Token', newAccessToken);
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        res.locals.user = token.decoded.user;
        next();
      } catch (error) {
        return res.status(HttpStatusCode.Unauthorized).send({
          success: false,
          statusCode: HttpStatusCode.BadRequest,
          message: 'Invalid Token.',
        });
      }
    }
  }
}
export const authorizationMiddleware = new AuthorizationMiddleware();
