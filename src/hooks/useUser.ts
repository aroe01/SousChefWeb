import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, deleteUserAccount } from '../lib/api';
import { useAuthContext } from '../context/AuthContext';

export const userKeys = {
  me: ['user', 'me'] as const,
};

export function useCurrentUserQuery() {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: userKeys.me,
    queryFn: getCurrentUser,
    enabled: !!user,
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  const { deleteAccount } = useAuthContext();

  return useMutation({
    mutationFn: async (userId: number) => {
      await deleteUserAccount(userId);
      await deleteAccount();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
