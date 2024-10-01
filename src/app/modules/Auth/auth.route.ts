import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from '../User/user.controller';
import { UserValidation } from '../User/user.validation';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import { authenticateUser } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.userSignUp,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.userlogin,
);

router.post(
  '/change-password',
  authenticateUser,
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);


router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

export const AuthRoutes = router;
