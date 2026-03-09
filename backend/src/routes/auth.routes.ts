import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller';
import { validate } from '../utils/validate.middleware';
import { registerSchema, loginSchema } from '../models/auth.schema';

const router = Router();

router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login', validate(loginSchema), login);
router.post('/auth/refresh', refreshToken);
router.post('/auth/logout', logout);

export default router;