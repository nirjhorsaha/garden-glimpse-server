import express from 'express';
import { UserController } from '../User/user.controller';
import { authenticateUser } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/', UserController.getAllUsers);

router.get('/:userId', authenticateUser, UserController.getUserById);

// Route to update user profile
router.patch(
  '/update-profile',
  authenticateUser,
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUserProfile,
);

// Route to add a post to the user's favorites
router.post('/post/favorite-post', authenticateUser, UserController.addFavoritePost);

// Route to remove a post from the user's favorites
router.delete(
  '/post/remove-favorite-post',
  authenticateUser,
  UserController.removeFavoritePost,
);

// Route to get the user's favorite posts
router.get(
  '/post/favorite-posts',
  // authenticateUser,
  UserController.getFavoritePosts,
);

export const UserRoutes = router;
