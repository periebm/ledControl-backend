import jwt from 'jsonwebtoken';
import { envConfig } from '../../config/config';

const SECRET_KEY = envConfig.jwt_secret;

export class LoginService {
  constructor() {}

  public async login() {
    const user = {
      id: 1,
      username: 'john.doe',
    };

    const accessToken = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1d' });

    return {
      refreshToken,
      accessToken,
      user,
    };
  }

  public async refresh(refreshToken: string) {

    const decoded: any = jwt.verify(refreshToken, SECRET_KEY);
    const accessToken = jwt.sign({ user: decoded.user }, SECRET_KEY, { expiresIn: '1h' });
  
    return {
      decoded,
      accessToken
    };
  }
}
