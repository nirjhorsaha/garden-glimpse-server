/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  phone: string;
  address: string;
  followers?: string[];
  followings?: string[];
  profileImage: string;
  role: 'user' | 'admin';
  isDeleted: boolean;
  favouritePosts?: string[];
  profileVerified?: boolean;
}

//instance methods for checking if the user exist & checking if passwords are matched
export interface UserModel extends Model<IUser> {
  findUserByEmail(email: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
