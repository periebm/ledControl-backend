export interface IEspRepository {
  getHealth():Promise<boolean | unknown>;
}