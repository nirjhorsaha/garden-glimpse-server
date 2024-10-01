import { Router } from 'express';
import { PostController } from './post.controller';
import { authenticateUser } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { Postvalidation } from './post.validation';

const router = Router();

router.post(
  '/create-post',
  authenticateUser,
  validateRequest(Postvalidation.CreatePostSchema),
  PostController.createPost,
);

router.get('/', PostController.getAllPosts);

router.get('/:id', PostController.getPostById);

router.get('/user/my-post', authenticateUser, PostController.getUserPost);

router.patch(
  '/:id',
  authenticateUser,
  validateRequest(Postvalidation.UpdatePostSchema),
  PostController.updatePost,
);

router.delete('/:id', authenticateUser, PostController.deletePost);

// Add a comment to a post
router.post('/add-comment/:id', authenticateUser, PostController.addComment);

// Update a comment on a post
router.patch(
  '/:postId/comments/:commentId',
  authenticateUser,
  PostController.updateComment,
);

// Delete a comment on a post
router.delete(
  '/:postId/comments/:commentId',
  authenticateUser,
  PostController.deleteComment,
);

export const PostRoutes = router;
