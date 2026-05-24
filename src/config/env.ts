// import * as dotenv from 'dotenv';
// import { z } from 'zod';

// dotenv.config();

// const envSchema = z.object({
//     NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
//     PORT: z.string().transform(Number).default('3000'),
//     DATABASE_URL: z.string().url(),
//     JWT_SECRET: z.string().min(1),
//     JWT_EXPIRES_IN: z.string().default('7d'),
//     CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
// });

// export const env = envSchema.parse(process.env);

import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);