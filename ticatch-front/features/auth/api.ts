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

  const accessToken = response.data?.tokenDto?.accessToken;
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    console.error('Access Token이 응답에 없습니다:', response.data);
    throw new Error('Access Token이 없습니다.');
  }

  return response.data;
};
