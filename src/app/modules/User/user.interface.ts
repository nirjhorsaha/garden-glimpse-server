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
  profileImage: string;
  role: 'user' | 'admin';
  isDeleted: boolean;
  favouritePosts?: string[];
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  findUserByEmail(email: string): Promise<IUser>;

  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
