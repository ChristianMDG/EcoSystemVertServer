import { Request, Response, NextFunction } from 'express';

const forbidden = (res: Response, message: string) => {
  res.status(403).json({ message });
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return forbidden(res, 'No user info found');

    if (!roles.includes(req.user.role)) {
      return forbidden(res, 'Access denied: insufficient permissions');
    }

    next();
  };
};