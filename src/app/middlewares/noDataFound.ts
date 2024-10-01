//* Sends a standardized response indicating that no data was found.

import httpStatus from 'http-status';
import { Response } from 'express';

const noDataFound = (res: Response, message: string) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: message,
    data: [],
  });
};

export default noDataFound;
