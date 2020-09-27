export default class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message?: string, statusCode?: number) {
    Object.assign(this, { message, statusCode });
  }
}
