import { Types } from 'mongoose';

export interface IComments {
  _id?: string;
  commentatorId: Types.ObjectId; // Commentator id
  comment: string;
  isDeleted: boolean;
}

export interface IPost {
  authorId: Types.ObjectId; // Author's id
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
