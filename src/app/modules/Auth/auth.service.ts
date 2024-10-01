import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createToken } from './auth.utils';
import bcrypt from 'bcrypt';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findUserByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // Check if the provided password matches the stored password
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  // Prepare the JWT payload with user information
  const jwtPayload = {
    userId: user?._id,
    email: user.email,
    role: user.role,
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
  
  // checking if the user is exist
  const user = await User.findUserByEmail(userEmail);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

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

  // checking if the user is exist
  const user = await User.findUserByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
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

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
};

// const loginUser = async (email: string, password: string) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
//   }

//   const isPasswordMatch = await bcrypt.compare(password, user.password);

//   if (!isPasswordMatch) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Password!');
//   }
//   return user;
// }
