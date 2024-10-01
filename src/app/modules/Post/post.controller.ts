import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { PostService } from './post.service';
import { verifyToken } from '../../middlewares/auth';
import noDataFound from '../../middlewares/noDataFound';
import { Types } from 'mongoose';

const createPost = catchAsync(async (req, res) => {
  const postData = req.body;

  const savedPost = await PostService.createPost(postData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post created successfully',
    data: savedPost,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const posts = await PostService.getAllPosts(req.query);
  // Check if any posts were found
  if (posts.result.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No posts found',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts fetched successfully',
    data: posts,
  });
});

const getPostById = catchAsync(async (req, res) => {
  const postId = new Types.ObjectId(req.params.id);

  const post = await PostService.getSinglePost(postId);

  if (!post) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Post not found',
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post fetched successfully',
    data: post,
  });
});

const getUserPost = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Authorization token not found',
    });
  }

  const decodedToken = verifyToken(token);
  const userEmail = decodedToken.email;

  const post = await PostService.getUserPost(userEmail);

  if (post.length === 0) {
    return noDataFound(res, 'No post found.!');
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User post retrieved successfully',
    data: post,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const updatedData = req.body;

  const updatedPost = await PostService.updatePost(postId, updatedData);

  if (!updatedPost) {
    return noDataFound(res, 'Post not found.!');
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post updated successfully',
    data: updatedPost,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const postId = req.params.id;

  const deletedPost = await PostService.deletePost(postId);

  if (!deletedPost) {
    return noDataFound(res, 'Post not found.!');
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully',
    data: deletedPost,
  });
});

// Add a comment on a post
const addComment = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const { commentatorId, comment } = req.body;

  const commentData = {
    commentatorId,
    comment,
    isDeleted: false,
  };

  const updatedPost = await PostService.addComment(postId, commentData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment added successfully',
    data: updatedPost,
  });
});

// Update a comment on a post
const updateComment = catchAsync(async (req, res) => {
    const { postId, commentId } = req.params;
    const { comment } = req.body;
  
    // Extract user ID from the token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'Authorization token not found',
      });
    }
    
    const decodedToken = verifyToken(token);
    const userId = decodedToken.userId;
  
    // Fetch the comment to verify ownership
    const existingComment = await PostService.getCommentById(postId, commentId);
    if (!existingComment || existingComment.commentatorId.toString() !== userId) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: 'You are not authorized to update this comment',
      });
    }
  
    // Proceed with update
    const updatedCommentData = { comment };
    const updatedPost = await PostService.updateComment(postId, commentId, updatedCommentData);
  
    if (!updatedPost) {
      return noDataFound(res, 'Comment not found');
    }
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment updated successfully',
      data: updatedPost,
    });
  });
  

// Delete a comment on a post
const deleteComment = catchAsync(async (req, res) => {
    const { postId, commentId } = req.params;
  
    // Extract user ID from the token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'Authorization token not found',
      });
    }
  
    const decodedToken = verifyToken(token);
    const userId = decodedToken.userId;
  
    // Fetch comment by ID to verify ownership
    const existingComment = await PostService.getCommentById(postId, commentId);
    if (!existingComment || existingComment.commentatorId.toString() !== userId) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: 'You are not authorized to delete this comment',
      });
    }
  
    // Proceed with deletion
    const updatedPost = await PostService.deleteComment(postId, commentId);
  
    if (!updatedPost) {
      return noDataFound(res, 'Comment not found');
    }
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment deleted successfully',
      data: updatedPost,
    });
  });
  
// Exporting all the controller methods
export const PostController = {
  createPost,
  getAllPosts,
  getPostById,
  getUserPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
};
