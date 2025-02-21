// hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth-service';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) => authService.register(data),
    onSuccess: () => {
      router.push('/auth/login');
    },
  });
};
