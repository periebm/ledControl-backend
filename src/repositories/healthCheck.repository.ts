import { HttpStatusCode } from 'axios';
import { AppError } from '../errors/AppError';
import { IHealthCheckRepository } from '../features/healthCheck/IHealthCheck.repository';

class HealthCheckRepository implements IHealthCheckRepository {

  async oracleHealth(): Promise<number | unknown> {

    try {
      return true;
    } catch (error)  {
      console.error('HealthCheckRepository : oracleHealth :');
      throw new AppError(
        'Algo deu errado.',
        HttpStatusCode.BadRequest,
        'ERROR : HealthCheckRepository > oracleHealth',
      );
    }
  }
}

const healthCheckRepository = new HealthCheckRepository();

export default healthCheckRepository;