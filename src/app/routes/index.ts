import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
// import { PaymentRoutes } from '../modules/Payment/payments.routes';
import { PostRoutes } from '../modules/Post/post.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  // {
  //   path: '/payment',
  //   route: PaymentRoutes,
  // },
  {
    path: '/post',
    route: PostRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
