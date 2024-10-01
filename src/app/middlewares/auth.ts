/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';

// Middleware for authenticate users
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // checking if the token is missing
  if (!token) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Authorization token missing',
    });
  }

  try {
    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    // Attach user id and role to request object
    (req as any).userId = decoded.sub;
    (req as any).userRole = decoded.role;
    next();
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message: 'Invalid token!',
    });
  }
};

// Middleware for authorize admin users
const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any)?.userRole !== 'admin') {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'You have no access to this route',
    });
  } else {
    next();
  }
};

// Function to verify jwt token
// const verifyToken = (token: string) => {
//   return jwt.verify(token, process.env.jwt_access_secret as string) as {
//     email: string;
//   };
// };

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt_access_secret as string) as {
      userId: string;
      email: string;
    };
  } catch (err) {
    throw new Error('Invalid token');
  }
};
export { authenticateUser, authorizeAdmin, verifyToken };
