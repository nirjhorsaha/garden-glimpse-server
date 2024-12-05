import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';
import { checkUserExistance } from '../../utils/checkUser';
import { hashPassword } from '../../middlewares/auth';

const loginUser = async (payload: TLoginUser) => {
  const user = await checkUserExistance(payload.email);

  // Check if the provided password matches the stored password
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  // Prepare the JWT payload with user information
  const jwtPayload = {
    userId: user?._id,
    name: user?.name,
    email: user.email,
    role: user.role,
    profileImage: user?.profileImage,
    address: user?.address,
    phone: user?.phone,
    favouritePosts: user?.favouritePosts,
    followers: user?.followers,
    followings: user?.followings,
    profileVerified: user?.profileVerified,
  };

  // Generate JWT token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userEmail: string,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await checkUserExistance(userEmail);
  // // checking if the user is exist
  // const user = await User.findUserByEmail(userEmail);
  // if (!user) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  // }
  // // checking if the user is already deleted
  // const isDeleted = user?.isDeleted;

  // if (isDeleted) {
  //   throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  // }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await hashPassword(payload.newPassword);

  await User.findOneAndUpdate(
    {
      email: userEmail,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { email } = decoded;

  const user = await checkUserExistance(email);

  // const user = await User.findUserByEmail(email);

  // if (!user) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  // }

  // const jwtPayload = {
  //   email: user.email,
  //   role: user.role,
  // };
  const jwtPayload = {
    userId: user?._id,
    name: user?.name,
    email: user.email,
    role: user.role,
    profileImage: user?.profileImage,
    address: user?.address,
    phone: user?.phone,
    favouritePosts: user?.favouritePosts,
    followers: user?.followers,
    followings: user?.followings,
    profileVerified: user?.profileVerified,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userEmail: string) => {
  const user = await checkUserExistance(userEmail);

  const jwtPayload = {
    userId: user._id,
    role: user.role,
    email: user.email,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?email=${user?.email}&token=${resetToken} `;

  sendEmail(user.email, resetUILink);

  // console.log(resetUILink);
};

const resetPassword = async (
  payload: { userEmail: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.findUserByEmail(payload.userEmail);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (payload.userEmail !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await hashPassword(payload.newPassword);

  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
