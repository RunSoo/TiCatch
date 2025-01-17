import axiosClient from 'lib/axiosClient';
import { LoginResponse, UserStatusResponse } from '@types';

/**
 * 사용자 로그인 상태 확인
 * @returns 로그인 상태 데이터
 */
export const fetchUserStatus = async (): Promise<UserStatusResponse> => {
  const response = await axiosClient.get<UserStatusResponse>('/auth/status');
  return response.data;
};

/**
 * 카카오 인증 코드로 로그인 요청
 * @param code 카카오에서 받은 인가 코드
 * @returns 로그인 응답 데이터
 */
export const loginWithKakao = async (code: string): Promise<LoginResponse> => {
  const response = await axiosClient.get('/auth/login/kakao', {
    params: { code },
  });

  return response.data;
};
