import express from 'express';
import { UserController } from '../User/user.controller';
import { authenticateUser } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/', UserController.getAllUsers);

router.patch(
  '/update-profile',
  authenticateUser,
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUserProfile,
);

router.post(
  '/favorite-post',
  authenticateUser,
  UserController.addFavoritePost,
);

router.delete(
  '/remove-favorite-post',
  authenticateUser,
  UserController.removeFavoritePost,
);

router.get(
  '/favorite-posts',
  authenticateUser,
  UserController.getFavoritePosts,
);

export const UserRoutes = router;
