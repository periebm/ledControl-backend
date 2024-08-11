import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envConfig } from '../config/config';
import { HttpStatusCode } from 'axios';

const SECRET_KEY = envConfig.jwt_secret;

class AuthorizationMiddleware {
  constructor() {
    this.jwtValidator = this.jwtValidator.bind(this); // Bind the context of this
    //TODO: remover o texto
    /*
    O método jwtValidator pode ser chamado de forma que o contexto do this não seja preservado, especialmente quando usado como middleware em um framework
     como o Express. O Express chama middlewares com seu próprio contexto, o que pode fazer com que this dentro do middleware não seja o que você espera.
     Para resolver o problema no primeiro código, você pode garantir que o método jwtValidator seja sempre chamado com o contexto correto,
     vinculado à instância da classe. Aqui está uma forma de fazer isso usando a vinculação explícita no construtor
    */
  }

  private validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (typeof decoded === 'string') {
        return { decoded: null, err: new Error('Formato decoded errado.') };
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
        message: 'Não autorizado.',
      });
    }

    try {
      if (accessToken) {
        const token = jwt.verify(accessToken, SECRET_KEY) as JwtPayload;
        if(!token.user) throw new Error();

        res.locals.user = token.user;
        return next();
      }
    } catch (error) {
      if (!refreshToken) {
        return res.status(HttpStatusCode.Unauthorized).send({
          success: false,
          statusCode: HttpStatusCode.Unauthorized,
          message: 'Não autorizado. Refresh Token',
        });
      }

      try {
        const token = jwt.verify(refreshToken, SECRET_KEY) as JwtPayload;
        if(!token.user) throw new Error();

        const newAccessToken = jwt.sign({ user: token.user }, SECRET_KEY, {
          expiresIn: '1h',
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
        });
        console.log('NOVO TOKEN DE ACESSO', newAccessToken);
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        res.locals.user = token.decoded.user;
        next();
      } catch (error) {
        return res.status(HttpStatusCode.Unauthorized).send({
          success: false,
          statusCode: HttpStatusCode.BadRequest,
          message: 'Token inválido.',
        });
      }
    }
  }
}
export const authorizationMiddleware = new AuthorizationMiddleware();
