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
  // Check if the user already has the post in their favorites
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the postId already exists in favouritePosts
  if (user.favouritePosts && user.favouritePosts.includes(postId)) {
    throw new AppError(httpStatus.CONFLICT, 'Post is already in favorites');
  }

  // Add the postId to the user's favouritePosts array
  user.favouritePosts = [...(user.favouritePosts || []), postId];

  // Save the updated user document
  await user.save();

  // Populate post details
  const populatedPosts = await Post.find({ _id: { $in: user.favouritePosts } });

  return {
    user,
    favouritePosts: populatedPosts,
  }; // Return the updated user along with populated posts
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
  const populatedPosts = await Post.find({ _id: { $in: user.favouritePosts } });

  return populatedPosts; // Return the populated favorite posts
};

export const UserService = {
  createUser,
  updateUser,
  getAllUsers,
  addFavoritePost,
  removeFavoritePost,
  getFavoritePosts,
};
