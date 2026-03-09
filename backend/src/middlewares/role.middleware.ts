import { Request, Response, NextFunction } from 'express';
export const authorizeRole = (role: "ADMIN" | "CLIENT") => {
    return (req: Request, res: Response, next: NextFunction) => {
  
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      if (req.user.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      next();
    };
  };