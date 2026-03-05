// Types globaux pour l'application
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

// Types pour JWT
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Types pour les rôles utilisateur (sera complété dans le module auth)
export type UserRole = 'admin' | 'client' | 'trainer';