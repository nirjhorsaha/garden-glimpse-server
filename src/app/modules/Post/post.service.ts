import mongoose, { Types } from 'mongoose';
import { IComments, IPost } from './post.interface';
import { Post } from './post.model';
import { User } from '../User/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { PostSearchableFields } from './post.constant';

const createPost = async (postData: IPost): Promise<IPost> => {
  const post = new Post(postData);
  return await post.save();
};

const getAllPosts = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find({ isDeleted: false }).populate('authorId', 'name'),
    query,
  )
    .search(PostSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSinglePost = async (postId: Types.ObjectId): Promise<IPost | null> => {
  return await Post.findById(postId).populate('authorId', 'name');
};

const getSingleUserPost = async (authorId: string) => {
  return await Post.find({
    authorId,
    isDeleted: false,
  }).populate('authorId', 'name');
};

const getUserPost = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }

  const findPost = await Post.find({
    authorId: user?._id,
    isDeleted: false,
  }).populate('authorId', 'name');
  return findPost;
};

const updatePost = async (
  postId: string,
  updatedData: Partial<IPost>,
): Promise<IPost | null> => {
  if (!mongoose.isValidObjectId(postId)) {
    throw new Error('Invalid post ID');
  }
  return await Post.findByIdAndUpdate(postId, updatedData, { new: true });
};

const deletePost = async (postId: string): Promise<IPost | null> => {
  if (!mongoose.isValidObjectId(postId)) {
    throw new Error('Invalid post ID');
  }
  return await Post.findByIdAndUpdate(
    postId,
    { isDeleted: true },
    { new: true },
  );
};

// Add a comment to a post
const addComment = async (postId: string, commentData: IComments) => {
  if (!mongoose.isValidObjectId(postId)) {
    throw new Error('Invalid post ID');
  }

  // Create a new comment with isDeleted set to false
  const newComment = { ...commentData, isDeleted: false };

  // Push the new comment to the comments array
  return await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: newComment } },
    { new: true },
  );
};

// Update a comment
const updateComment = async (
  postId: string,
  commentId: string,
  updatedComment: Partial<IComments>,
): Promise<IPost | null> => {
  if (
    !mongoose.isValidObjectId(postId) ||
    !mongoose.isValidObjectId(commentId)
  ) {
    throw new Error('Invalid post or comment ID');
  }

  // Find the post by ID
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  // Ensure comments array is defined
  if (!post.comments) {
    throw new Error('No comments found on this post');
  }

  // Find the comment in the comments array
  const comment = post.comments.find((c) => c._id!.toString() === commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  // Update the comment fields
  Object.assign(comment, updatedComment);

  // Save the updated post
  const updatedPost = await post.save();

  return updatedPost; // Return the updated post with the modified comment
};

// Soft delete a comment
const deleteComment = async (
  postId: string,
  commentId: string,
): Promise<IPost | null> => {
  if (
    !mongoose.isValidObjectId(postId) ||
    !mongoose.isValidObjectId(commentId)
  ) {
    throw new Error('Invalid post or comment ID');
  }

  // Find the post by ID
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }
  // Ensure comments array is defined
  if (!post.comments) {
    throw new Error('No comments found on this post');
  }

  // Find the comment in the comments array
  const comment = post.comments.find((c) => c._id!.toString() === commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  // Set `isDeleted` to true for the found comment
  comment.isDeleted = true;

  // Save the updated post
  const updatedPost = await post.save();

  return updatedPost; // Return the updated post with the modified comment
};

const getCommentById = async (postId: string, commentId: string) => {
  const post = await Post.findById(postId);

  // If the post doesn't exist or doesn't have comments, return null
  if (!post || !post.comments || !Array.isArray(post.comments)) {
    return null;
  }

  // Find the comment in the post's comments array
  const comment = post.comments.find(
    (comment) => comment._id!.toString() === commentId,
  );
  return comment || null;
};

export const PostService = {
  createPost,
  getAllPosts,
  getSinglePost,
  getSingleUserPost,
  getUserPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  getCommentById,
};
