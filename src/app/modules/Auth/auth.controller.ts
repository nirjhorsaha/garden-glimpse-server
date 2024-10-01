import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { verifyToken } from '../../middlewares/auth';

const userlogin = catchAsync(async (req: Request, res: Response) => {
  const user = await AuthService.loginUser(req.body);
  const { refreshToken, ...userData } = user;

  if (!user) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Invalid email or password',
    });
  }

  // Set the refresh token in an HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  // Return success response with token and user data
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: {
      ...userData,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'Authorization token not found');
  }
  const decodedToken = verifyToken(token);
  const userEmail = decodedToken.email;

  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(userEmail, passwordData);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});

// Function to handle refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

export const AuthController = {
  userlogin,
  changePassword,
  refreshToken,
};