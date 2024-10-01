import { Response } from 'express';

// Define a generic type for the response structure
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data?: T;
};

//* Sends a standardized JSON response to the client.
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
  });
};

export default sendResponse;
