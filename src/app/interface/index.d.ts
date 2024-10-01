// This code extends the Express Request interface to include a `user` property of type JwtPayload.
// This allows for type-safe access to the decoded JWT payload in request handlers after authentication.

import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}