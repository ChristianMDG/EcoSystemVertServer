import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../utils/validate.middleware';
import { registerSchema, loginSchema } from '../models/auth.schema';

const router = Router();

router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login', validate(loginSchema), login);

export default router;