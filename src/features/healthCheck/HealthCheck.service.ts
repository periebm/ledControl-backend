import { IHealthCheckRepository } from './IHealthCheck.repository';

export class HealthCheckService {
  constructor(private repository: IHealthCheckRepository) {}

  private formatUpTime(seconds: number) {
    function pad(s: number) {
      return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor((seconds % (60 * 60)) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  }

  async checkHealth() {
    var uptime = this.formatUpTime(process.uptime());

    const startTimeOracle = new Date().getTime();
    const oracleHealth = await this.repository.oracleHealth();
    const endTimeOracle = new Date().getTime();

/*     const oracleDbStatus = !oracleHealth
      ? 'OracleDB connection error'
      : `Success. Response returned in ${endTimeOracle - startTimeOracle}ms`; */

    return {
      apiName: `ESPProject - ${process.env.NODE_ENV} mode`,
      uptime,
    };
  }
}
