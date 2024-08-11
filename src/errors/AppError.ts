export class AppError extends Error {
  public statusCode: number;
  public location: string;

  constructor(message: string, statusCode: number, location: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.location = location

    Object.setPrototypeOf(this, AppError.prototype);
  }
}