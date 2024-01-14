export interface Result<T> {
  error: boolean;
  success: boolean;
  data: T;
  message: string;
}
