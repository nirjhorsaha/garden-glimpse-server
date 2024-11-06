import { model, Schema } from 'mongoose';
import { IComments, IPost } from './post.interface';

const CommentSchema = new Schema<IComments>(
  {
    commentatorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comment: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

const PostSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Vegetables',
        'Flowers',
        'Landscaping',
        'Succulents',
        'Indoor Plants',
        'Others',
      ],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    upVoteCount: {
      type: Number,
      default: 0,
    },
    downVoteCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    comments: [CommentSchema], // Array of comments
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Post = model<IPost>('Post', PostSchema);
