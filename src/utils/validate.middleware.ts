import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';


export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        message: error.errors?.map((e: any) => e.message) || error.message,
      });
      return;
    }
  };