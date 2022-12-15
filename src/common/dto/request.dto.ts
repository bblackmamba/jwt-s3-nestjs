import User from '../../user/models/user.model';

// eslint-disable-next-line import/no-extraneous-dependencies
export type { Request } from 'express';

export interface AuthRequest extends Request {
  currentUser?: User
}
