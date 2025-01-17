import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserStatus, loginWithKakao } from './api';

export const useUserStatus = () => {
  return useQuery({
    queryKey: ['userStatus'],
    queryFn: fetchUserStatus,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * 카카오 로그인 훅
 * @returns 로그인 Mutation 훅
 */
export const useLoginWithKakao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => loginWithKakao(code),
    onSuccess: (data) => {
      const { userId, userNickname } = data.data;
      queryClient.setQueryData(['userStatus'], {
        isLoggedIn: true,
        user: {
          id: userId,
          nickName: userNickname,
        },
      }); // React Query 캐시 업데이트
    },
    onError: (error: Error) => {
      console.error('로그인 실패:', error.message);
    },
  });
};
