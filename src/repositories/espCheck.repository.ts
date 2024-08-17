import axios, { HttpStatusCode } from 'axios';
import { AppError } from '../errors/AppError';
import { IEspRepository } from '../features/esp/IEsp.repository';
import { envConfig } from '../config/config';

const ESP_URL = envConfig.esp.address;

class EspRepository implements IEspRepository {
  async getHealth(): Promise<number | unknown> {
    try {
      const response = await axios.get(`${ESP_URL}/health`);
      console.log(response.data)
      return true;
    } catch (error) {
      console.error(error);
      console.error('HealthCheckRepository : oracleHealth :');
      throw new AppError(
        'O servidor ESP não está respondendo.',
        HttpStatusCode.BadRequest,
        'ERROR : EspRepository > getHealth',
      );
    }
  }
}

const espRepository = new EspRepository();

export default espRepository;
