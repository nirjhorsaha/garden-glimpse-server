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
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,
      required: true,
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


userSchema.statics.findUserByEmail = async function (email: string) {
  return await User.findOne({ email });
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};


userSchema.methods.addFavouritePost = async function (postId: string) {
  if (!this.favouritePosts) {
    this.favouritePosts = [];
  }

  if (!this.favouritePosts.includes(postId)) {
    this.favouritePosts.push(postId);
    await this.save();
  }
};

userSchema.methods.removeFavouritePost = async function (postId: string) {
  if (this.favouritePosts) {
    this.favouritePosts = this.favouritePosts.filter(
      (id: string) => id !== postId,
    );
    await this.save();
  }
};

export const User = model<IUser, UserModel>('User', userSchema);
