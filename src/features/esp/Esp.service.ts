import { IEspRepository } from './IEsp.repository';

export class EspService {
  constructor(private repository: IEspRepository) {}

  async checkHealth() {
    const response = await this.repository.getHealth();
    return response;
  }
}
