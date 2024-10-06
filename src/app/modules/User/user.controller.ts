import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import noDataFound from '../../middlewares/noDataFound';
import AppError from '../../errors/AppError';
import { verifyToken } from '../../middlewares/auth';

const userSignUp = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserService.getAllUsers();

  if (users.length === 0) {
    return noDataFound(res, 'User not found');
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'Authorization token not found');
  }
  const decodedToken = verifyToken(token);
  const userEmail = decodedToken.email;

  const { ...updateData } = req.body;

  const updatedUser = await UserService.updateUser(userEmail, updateData);

  if (!updatedUser) {
    return noDataFound(res, 'Updating user failed');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully',
    data: updatedUser,
  });
});

const addFavoritePost = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Authorization token not found',
    );
  }

  const decodedToken = verifyToken(token);
  const userId = decodedToken.userId;

  const { postId } = req.body;
  const updatedUser = await UserService.addFavoritePost(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post added to favorites successfully',
    data: updatedUser.favouritePosts,
  });
});

const removeFavoritePost = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Authorization token not found',
    );
  }

  const decodedToken = verifyToken(token);
  const userId = decodedToken.userId; // Assuming your token contains the user ID

  const { postId } = req.body;

  // remove the favorite post
  const updatedUser = await UserService.removeFavoritePost(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post removed from favorites successfully',
    data: updatedUser,
  });
});

const getFavoritePosts = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Authorization token not found',
    );
  }

  const decodedToken = verifyToken(token);
  const userId = decodedToken.userId;

  const favoritePosts = await UserService.getFavoritePosts(userId);

  if (favoritePosts.length === 0) {
    noDataFound(res, 'NO Favorite Posts Found.!');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favorite posts retrieved successfully',
    data: favoritePosts,
  });
});

export const UserController = {
  userSignUp,
  getAllUsers,
  updateUserProfile,
  addFavoritePost,
  removeFavoritePost,
  getFavoritePosts,
};
