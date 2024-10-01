import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits long'),
    role: z.enum(['admin', 'user']),
    address: z.string().min(1, 'Address is required'),
    profileImage: z.string().url('Invalid image URL'),
    //   role: z.enum([...TRole] as [string, ...string[]]),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .optional(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits long')
      .optional(),
    role: z.enum(['admin', 'user']).optional(),
    address: z.string().min(1, 'Address is required').optional(),
    profileImage: z.string().url('Invalid image URL').optional(),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

// const addFavoritePostValidationSchema = z.object({
//   body: z.object({
//     postId: z.string().min(1, 'Post ID is required'),
//   }),
// });

// const removeFavoritePostValidationSchema = z.object({
//   body: z.object({
//     postId: z.string().min(1, 'Post ID is required'),
//   }),
// });

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  loginUserValidationSchema,
  // addFavoritePostValidationSchema,
  // removeFavoritePostValidationSchema
};
