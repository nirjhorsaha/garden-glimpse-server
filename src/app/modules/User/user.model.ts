/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    favouritePosts: {
      type: [Schema.Types.ObjectId],
      // ref: 'User',
      default: [],
    },
    profileImage: {
      type: String,
      required: true,
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    }, // Array of follower IDs
    followings: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    profileVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Middleware for pre-saving actions
userSchema.pre<IUser>('save', async function (next) {
  const user = this; // 'this' refers to the document being saved

  // Hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// Transform the output to remove the password field
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

// Static method to find a user by their email address
userSchema.statics.findUserByEmail = async function (email: string) {
  return await User.findOne({ email });
};

// Static method to compare a plain text password with a hashed password
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Method to add a post to the user's list of favorite posts
userSchema.methods.addFavouritePost = async function (postId: string) {
  if (!this.favouritePosts) {
    this.favouritePosts = [];
  }

  if (!this.favouritePosts.includes(postId)) {
    this.favouritePosts.push(postId);
    await this.save();
  }
};

// Method to remove a post from the user's list of favorite posts
userSchema.methods.removeFavouritePost = async function (postId: string) {
  if (this.favouritePosts) {
    this.favouritePosts = this.favouritePosts.filter(
      (id: string) => id !== postId,
    );
    await this.save();
  }
};

export const User = model<IUser, UserModel>('User', userSchema);
