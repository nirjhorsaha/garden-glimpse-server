import { Types } from 'mongoose';

export interface IComments {
  _id?: string;
  commentatorId: Types.ObjectId; // commentator id
  comment: string;
  isDeleted: boolean;
}

export interface IPost {
  authorId: Types.ObjectId; // author's id
  title: string;
  content: string;
  category:
    | 'Vegetables'
    | 'Flowers'
    | 'Landscaping'
    | 'Succulents'
    | 'Indoor Plants'
    | 'Others';
  images: string[];
  updatedAt?: Date;
  isPremium: boolean;
  upVoteCount: number;
  downVoteCount: number;
  isDeleted: boolean;
  comments?: IComments[];
}
