import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { Post } from '../Post/post.model';

const createUser = async (userData: Partial<IUser>) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const getAllUsers = async () => {
  const result = await User.find();
  return result;
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user; // Return the found user
};

const updateUser = async (userEmail: string, updateData: Partial<IUser>) => {
  const updatedUser = await User.findOneAndUpdate(
    { email: userEmail },
    updateData,
    {
      new: true,
    },
  );
  return updatedUser;
};

const addFavoritePost = async (userId: string, postId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.favouritePosts?.includes(postId)) {
    throw new AppError(httpStatus.CONFLICT, 'Post is already in favorites');
  }

  // Use $addToSet to avoid duplicate entries and only modify the specific field
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favouritePosts: postId } },
    { new: true } // Return the updated document
  );

  if (!updatedUser) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update user');
  }

  // Populate the favorite posts
  const populatedPosts = await Post.find({ _id: { $in: updatedUser.favouritePosts } });

  return {
    user: updatedUser,
    favouritePosts: populatedPosts,
  };
};


const removeFavoritePost = async (userId: string, postId: string) => {
  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the postId exists in favouritePosts
  if (!user.favouritePosts || !user.favouritePosts.includes(postId)) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found in favorites');
  }

  // Remove the postId from the user's favouritePosts array
  user.favouritePosts = user.favouritePosts.filter((id) => id !== postId);

  // Save the updated user document
  await user.save();

  return user; // Return the updated user
};

const getFavoritePosts = async (userId: string) => {
  const user = await User.findById(userId).populate('favouritePosts');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Populate the details of the favorite posts
  const populatedPosts = await Post.find({
    _id: { $in: user.favouritePosts },
  }).populate('authorId');

  return populatedPosts; // Return the populated favorite posts
};

export const UserService = {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  addFavoritePost,
  removeFavoritePost,
  getFavoritePosts,
};
