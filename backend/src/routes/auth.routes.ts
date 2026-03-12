import { Router } from 'express';
import { register, login, refreshToken, logout, getAllUsers } from '../controllers/auth.controller';
import { validate } from '../utils/validate.middleware';
import { registerSchema, loginSchema } from '../models/auth.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login', validate(loginSchema), login);
router.post('/auth/refresh', refreshToken);
router.post('/auth/logout', logout);;
router.get('/auth/users', getAllUsers);
router.get('/auth/profile', authMiddleware, (req, res) => {
    res.json({ 
      user: req.user || null
    });
  });
export default router;