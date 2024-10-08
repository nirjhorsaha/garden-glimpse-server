//* Sends a standardized response for requests to routes that do not exist.
import { error } from 'console';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: 'Not Found',
    error: error,
  });
};

export default notFound;
