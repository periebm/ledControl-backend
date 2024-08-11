export interface IHealthCheckRepository {
  oracleHealth():Promise<boolean | unknown>;
}