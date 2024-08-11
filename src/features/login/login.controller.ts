import { NextFunction, Request, Response } from 'express';
import { LoginService } from './login.service';

class LoginController {
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginService = new LoginService();

      const response = await loginService.login();
      res
      .cookie('refreshToken', response.refreshToken, { httpOnly: true, sameSite: 'strict' })
      .header('Authorization', response.accessToken)
      .send(response.user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
      }

      const loginService = new LoginService();

      const response = await loginService.refresh(refreshToken);
      res
      .header('Authorization', `Bearer ${response.accessToken}`)
      .send(response.decoded.user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

const loginController = new LoginController();

export default loginController;
