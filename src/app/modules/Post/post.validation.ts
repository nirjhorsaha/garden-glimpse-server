import { z } from 'zod';

const CommentSchema = z.object({
  commentatorId: z.string().min(1, 'Commentator ID is required.'),
  comment: z.string().min(1, 'Comment is required.'),
  isDeleted: z.boolean().optional(),
});

const CreatePostSchema = z.object({
  body: z.object({
    authorId: z.string().min(1, 'Author ID is required.'),
    title: z.string().min(1, 'Title is required.'),
    content: z.string().min(1, 'Content is required.'),
    category: z.enum(
      [
        'Vegetables',
        'Flowers',
        'Landscaping',
        'Succulents',
        'Indoor Plants',
        'Others',
      ],
      {
        errorMap: () => ({
          message:
            'Category must be one of: Vegetables, Flowers, Landscaping, Succulents,Indoor Plants,  Others.',
        }),
      },
    ),
    images: z
      .array(z.string().url('Each image must be a valid URL.'))
      .nonempty('At least one image is required.'),
    isPremium: z.boolean().optional().default(false),
  }),
});

const UpdatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required.').optional(),
    content: z.string().min(1, 'Content is required.').optional(),
    category: z
      .enum(['Vegetables', 'Flowers', 'Landscaping', 'Succulents', 'Indoor Plants', 'Others'], {
        errorMap: () => ({
          message:
            'Category must be one of: Vegetables, Flowers, Landscaping, Succulents, Indoor Plants Others.',
        }),
      })
      .optional(),
    images: z
      .array(z.string().url('Each image must be a valid URL.'))
      .optional(),
    isPremium: z.boolean().optional(),
    upVoteCount: z.number().optional(),
    downVoteCount: z.number().optional(),
    isDeleted: z.boolean().optional(),
    comments: z.array(CommentSchema).optional(),
  }),
});

export const Postvalidation = {
  CreatePostSchema,
  UpdatePostSchema,
};
