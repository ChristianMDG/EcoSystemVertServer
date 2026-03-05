# MODULE 1 : Configuration complète du projet

## 1️⃣ Explication courte

Je vais mettre en place la structure complète du projet EcoVert Mada avec :
- Initialisation du projet Node.js/TypeScript
- Installation des dépendances
- Configuration des variables d'environnement
- Configuration de la base de données PostgreSQL
- Structure des dossiers selon l'architecture modulaire
- Fichiers de base (server.ts, app.ts)

## 2️⃣ Structure des fichiers

```
ecouvert-backend/
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
│
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   │
│   ├── middlewares/
│   │   └── error.middleware.ts
│   │
│   ├── utils/
│   │   └── logger.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── courses/
│   │   ├── energy/
│   │   ├── waste/
│   │   └── recommendations/
│   │
│   ├── app.ts
│   └── server.ts
│
└── prisma/
    └── schema.prisma
```

## 3️⃣ Code complet des fichiers

### package.json

```json
{
  "name": "ecouvert-backend",
  "version": "1.0.0",
  "description": "Backend for EcoVert Mada platform - Renewable energy, eco products, waste management and training",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "keywords": ["ecover", "energy", "renewable", "waste", "training"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.10.0",
    "nodemon": "^3.0.2",
    "prisma": "^5.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.2"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### .env

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecouvert_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# API
API_PREFIX="/api"
```

### .gitignore

```
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build
dist/
build/
*.tsbuildinfo

# Environment
.env
.env.local
.env.production
.env.development

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Database
prisma/*.db
prisma/*.db-journal
*.sqlite

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### src/config/env.ts

```typescript
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default('10'),
  API_PREFIX: z.string().default('/api'),
});

const envVars = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  API_PREFIX: process.env.API_PREFIX,
};

try {
  const parsed = envSchema.parse(envVars);
  
  export const config = {
    env: parsed.NODE_ENV,
    port: parsed.PORT,
    databaseUrl: parsed.DATABASE_URL,
    jwt: {
      secret: parsed.JWT_SECRET,
      expiresIn: parsed.JWT_EXPIRES_IN,
    },
    bcrypt: {
      saltRounds: parsed.BCRYPT_SALT_ROUNDS,
    },
    api: {
      prefix: parsed.API_PREFIX,
    },
  };
  
  console.log('✅ Environment variables loaded successfully');
} catch (error) {
  console.error('❌ Invalid environment variables:', error.errors);
  process.exit(1);
}
```

### src/config/database.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { config } from './env';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (config.env !== 'production') {
  global.prisma = prisma;
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  console.log('📦 Database disconnected');
};
```

### src/types/index.ts

```typescript
// User types
export type UserRole = 'admin' | 'client' | 'trainer';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

// Order status
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';

// Payment method
export type PaymentMethod = 'mobile_money' | 'bank_card';

// Payment status
export type PaymentStatus = 'pending' | 'completed' | 'failed';

// Project status
export type EnergyProjectStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled';

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Energy recommendation
export interface EnergyRecommendation {
  panelsNumber: number;
  batteryCapacity: number;
  estimatedCost: number;
  solutionId: string;
}
```

### src/utils/logger.ts

```typescript
import { config } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`;
  }

  info(message: string, meta?: any): void {
    if (config.env === 'test') return;
    console.log(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: any): void {
    if (config.env === 'test') return;
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, error?: any): void {
    if (config.env === 'test') return;
    console.error(this.formatMessage('error', message, error));
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  debug(message: string, meta?: any): void {
    if (config.env !== 'development') return;
    console.debug(this.formatMessage('debug', message, meta));
  }
}

export const logger = new Logger();
```

### src/middlewares/error.middleware.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', err);

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Prisma error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const target = err.meta?.target as string[];
      return res.status(409).json({
        success: false,
        message: `${target.join(', ')} already exists`,
        error: 'Unique constraint violation',
      });
    }

    // Foreign key constraint violation
    if (err.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Referenced record does not exist',
        error: 'Foreign key constraint violation',
      });
    }

    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
        error: 'Not found',
      });
    }
  }

  // Custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.name,
    });
  }

  // Unknown error
  const statusCode = 500;
  const message = config.env === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    error: 'InternalServerError',
    ...(config.env === 'development' && { stack: err.stack }),
  });
};
```

### src/app.ts

```typescript
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';

// Import routes (to be implemented in modules)
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import productsRoutes from './modules/products/products.routes';
import ordersRoutes from './modules/orders/orders.routes';
import coursesRoutes from './modules/courses/courses.routes';
import energyRoutes from './modules/energy/energy.routes';
import wasteRoutes from './modules/waste/waste.routes';
import recommendationsRoutes from './modules/recommendations/recommendations.routes';

const app: Application = express();

// Middlewares
app.use(cors({
  origin: config.env === 'development' ? '*' : process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'EcoVert Mada API is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// API Routes
const apiPrefix = config.api.prefix;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, usersRoutes);
app.use(`${apiPrefix}/products`, productsRoutes);
app.use(`${apiPrefix}/orders`, ordersRoutes);
app.use(`${apiPrefix}/courses`, coursesRoutes);
app.use(`${apiPrefix}/energy`, energyRoutes);
app.use(`${apiPrefix}/waste`, wasteRoutes);
app.use(`${apiPrefix}/recommendations`, recommendationsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use(errorHandler);

export default app;
```

### src/server.ts

```typescript
import app from './app';
import { config } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = config.port;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`
      🚀 EcoVert Mada Server is running!
      📡 Port: ${PORT}
      🌍 Environment: ${config.env}
      🔗 API: http://localhost:${PORT}${config.api.prefix}
      💚 Health: http://localhost:${PORT}/health
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

### prisma/schema.prisma

```prisma
// This is the initial schema with all 25 tables
// We'll create migrations as we build each module

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Users and Profiles
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  password       String
  name           String
  role           String    @default("client") // admin, client, trainer
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  profile        UserProfile?
  cart           Cart?
  orders         Order[]
  enrollments    Enrollment[]
  energyRequests EnergyRequest[]
  energyProjects EnergyProject[]
  coursesTaught  Course[]   @relation("TrainerCourses")

  @@map("users")
}

model UserProfile {
  id        String   @id @default(uuid())
  userId    String   @unique @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: CASCADE)
  phone     String?
  address   String?
  city      String?
  country   String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("user_profiles")
}

// E-commerce
model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  products    Product[]

  @@map("categories")
}

model Product {
  id          String    @id @default(uuid())
  name        String
  description String?
  price       Float
  stock       Int       @default(0)
  categoryId  String    @map("category_id")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  category    Category      @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  cartItems   CartItem[]
  orderItems  OrderItem[]

  @@map("products")
}

model ProductImage {
  id        String   @id @default(uuid())
  productId String   @map("product_id")
  product   Product  @relation(fields: [productId], references: [id], onDelete: CASCADE)
  imageUrl  String   @map("image_url")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("product_images")
}

model Cart {
  id        String   @id @default(uuid())
  userId    String   @unique @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: CASCADE)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  items CartItem[]

  @@map("carts")
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String   @map("cart_id")
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: CASCADE)
  productId String   @map("product_id")
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([cartId, productId])
  @@map("cart_items")
}

model Order {
  id         String     @id @default(uuid())
  userId     String     @map("user_id")
  user       User       @relation(fields: [userId], references: [id])
  totalPrice Float      @map("total_price")
  status     String     @default("pending") // pending, paid, shipped, delivered
  createdAt  DateTime   @default(now()) @map("created_at")
  updatedAt  DateTime   @updatedAt @map("updated_at")

  items   OrderItem[]
  payment Payment?

  @@map("orders")
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String   @map("order_id")
  order     Order    @relation(fields: [orderId], references: [id], onDelete: CASCADE)
  productId String   @map("product_id")
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float    // Price at time of order
  createdAt DateTime @default(now()) @map("created_at")

  @@map("order_items")
}

model Payment {
  id          String   @id @default(uuid())
  orderId     String   @unique @map("order_id")
  order       Order    @relation(fields: [orderId], references: [id], onDelete: CASCADE)
  amount      Float
  method      String   // mobile_money, bank_card
  status      String   @default("pending") // pending, completed, failed
  paymentDate DateTime @map("payment_date")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("payments")
}

// Training
model Course {
  id          String   @id @default(uuid())
  title       String
  description String?
  price       Float
  trainerId   String   @map("trainer_id")
  trainer     User     @relation("TrainerCourses", fields: [trainerId], references: [id])
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  lessons     Lesson[]
  enrollments Enrollment[]

  @@map("courses")
}

model Lesson {
  id        String   @id @default(uuid())
  courseId  String   @map("course_id")
  course    Course   @relation(fields: [courseId], references: [id], onDelete: CASCADE)
  title     String
  videoUrl  String?  @map("video_url")
  content   String?
  order     Int
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("lessons")
}

model Enrollment {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: CASCADE)
  courseId    String   @map("course_id")
  course      Course   @relation(fields: [courseId], references: [id], onDelete: CASCADE)
  enrolledAt  DateTime @default(now()) @map("enrolled_at")
  completedAt DateTime? @map("completed_at")

  @@unique([userId, courseId])
  @@map("enrollments")
}

// Energy
model EnergySolution {
  id            String   @id @default(uuid())
  name          String
  description   String?
  powerOutput   Float    @map("power_output")
  estimatedCost Float    @map("estimated_cost")

  materials        EnergyMaterial[]
  projects         EnergyProject[]
  recommendations  EnergyRecommendation[]

  @@map("energy_solutions")
}

model EnergyMaterial {
  id         String         @id @default(uuid())
  solutionId String         @map("solution_id")
  solution   EnergySolution @relation(fields: [solutionId], references: [id], onDelete: CASCADE)
  name       String
  quantity   String
  createdAt  DateTime       @default(now()) @map("created_at")
  updatedAt  DateTime       @updatedAt @map("updated_at")

  @@map("energy_materials")
}

model Location {
  id        String   @id @default(uuid())
  country   String
  region    String?
  city      String?
  latitude  Float?
  longitude Float?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  projects EnergyProject[]
  requests EnergyRequest[]
  centers  RecyclingCenter[]

  @@map("locations")
}

model EnergyProject {
  id         String          @id @default(uuid())
  userId     String          @map("user_id")
  user       User            @relation(fields: [userId], references: [id])
  solutionId String          @map("solution_id")
  solution   EnergySolution  @relation(fields: [solutionId], references: [id])
  locationId String          @map("location_id")
  location   Location        @relation(fields: [locationId], references: [id])
  status     String          @default("planning") // planning, in_progress, completed, cancelled
  createdAt  DateTime        @default(now()) @map("created_at")
  updatedAt  DateTime        @updatedAt @map("updated_at")

  @@map("energy_projects")
}

model EnergyRequest {
  id            String       @id @default(uuid())
  userId        String       @map("user_id")
  user          User         @relation(fields: [userId], references: [id])
  surface       Float
  consumption   Float
  budget        Float
  locationId    String       @map("location_id")
  location      Location     @relation(fields: [locationId], references: [id])
  createdAt     DateTime     @default(now()) @map("created_at")

  recommendation EnergyRecommendation?

  @@map("energy_requests")
}

model EnergyRecommendation {
  id             String          @id @default(uuid())
  requestId      String          @unique @map("request_id")
  request        EnergyRequest   @relation(fields: [requestId], references: [id], onDelete: CASCADE)
  solutionId     String          @map("solution_id")
  solution       EnergySolution  @relation(fields: [solutionId], references: [id])
  panelsNumber   Int             @map("panels_number")
  batteryCapacity Float          @map("battery_capacity")
  estimatedCost  Float           @map("estimated_cost")
  createdAt      DateTime        @default(now()) @map("created_at")

  @@map("energy_recommendations")
}

// Waste Management
model WasteType {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  solutions WasteSolution[]
  centers   RecyclingCenter[]

  @@map("waste_types")
}

model WasteSolution {
  id          String     @id @default(uuid())
  wasteTypeId String     @map("waste_type_id")
  wasteType   WasteType  @relation(fields: [wasteTypeId], references: [id], onDelete: CASCADE)
  solutionName String    @map("solution_name")
  description  String?
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  @@map("waste_solutions")
}

model RecyclingCenter {
  id          String     @id @default(uuid())
  name        String
  locationId  String     @map("location_id")
  location    Location   @relation(fields: [locationId], references: [id])
  wasteTypeId String     @map("waste_type_id")
  wasteType   WasteType  @relation(fields: [wasteTypeId], references: [id])
  contact     String?
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  @@map("recycling_centers")
}

// Statistics and Logs
model Statistic {
  id          String   @id @default(uuid())
  totalUsers  Int      @default(0) @map("total_users")
  totalOrders Int      @default(0) @map("total_orders")
  totalSales  Float    @default(0) @map("total_sales")
  totalCourses Int     @default(0) @map("total_courses")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("statistics")
}

model SystemLog {
  id        String   @id @default(uuid())
  level     String   // info, warn, error
  message   String
  metadata  Json?
  createdAt DateTime @default(now()) @map("created_at")

  @@map("system_logs")
}
```

### README.md

```markdown
# EcoVert Mada Backend

Plateforme intelligente pour les énergies renouvelables et la gestion écologique à Madagascar.

## 🚀 Technologies

- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Zod Validation
- Clean Architecture + Modular Architecture

## 📦 Installation

1. Cloner le repository
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Copier `.env.example` vers `.env` et configurer les variables
4. Démarrer PostgreSQL et créer la base de données
5. Générer Prisma client :
   ```bash
   npm run prisma:generate
   ```
6. Lancer les migrations :
   ```bash
   npm run prisma:migrate
   ```
7. Démarrer le serveur :
   ```bash
   npm run dev
   ```

## 🏗️ Structure du projet

```
src/
├── config/         # Configuration (DB, env)
├── modules/        # Modules fonctionnels
│   ├── auth/       # Authentification
│   ├── users/      # Gestion utilisateurs
│   ├── products/   # Produits écologiques
│   ├── orders/     # Commandes
│   ├── courses/    # Formations
│   ├── energy/     # Solutions énergétiques
│   ├── waste/      # Gestion déchets
│   └── recommendations/ # Suggestions intelligentes
├── middlewares/    # Middlewares globaux
├── utils/          # Utilitaires
├── types/          # Types TypeScript
├── app.ts          # Configuration Express
└── server.ts       # Point d'entrée
```

## 🔑 Variables d'environnement

- `PORT` - Port du serveur (défaut: 5000)
- `DATABASE_URL` - URL de connexion PostgreSQL
- `JWT_SECRET` - Clé secrète JWT
- `JWT_EXPIRES_IN` - Expiration JWT (défaut: 7d)
- `BCRYPT_SALT_ROUNDS` - Salt rounds pour bcrypt (défaut: 10)
- `API_PREFIX` - Préfixe des routes API (défaut: /api)

## 📚 API Documentation

L'API est documentée avec OpenAPI 3.0.3 et accessible à `/api-docs` (à implémenter).

## ✅ Modules à implémenter

1. ✅ Configuration du projet
2. ⬜ Authentification
3. ⬜ Users
4. ⬜ Products
5. ⬜ Orders
6. ⬜ Courses
7. ⬜ Energy Solutions
8. ⬜ Waste Management
9. ⬜ Recommendation System

## 📝 Licence

ISC
```

---

**MODULE 1 TERMINÉ – PRÊT POUR LE MODULE SUIVANT ?**