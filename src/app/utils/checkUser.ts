import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { User } from '../modules/User/user.model';

export const checkUserExistance = async (email: string) => {
  // checking if the user is exist
  const user = await User.findUserByEmail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is already deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }
  return user;
};
