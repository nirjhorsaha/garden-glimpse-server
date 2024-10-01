import { IUser } from "../modules/User/user.interface";


// Extend the Request interface
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser; // Add the user property
  }
}
