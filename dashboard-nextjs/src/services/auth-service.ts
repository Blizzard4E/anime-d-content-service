// services/auth-service.ts
import { fetchWithoutAuth } from '@/lib/api-client';

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const authService = {
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    return fetchWithoutAuth('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
};
