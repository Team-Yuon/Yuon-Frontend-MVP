// API 기본 URL 설정
export const API_BASE_URL = 'http://localhost:4000/v1';

// 로컬 스토리지 키
export const AUTH_TOKEN_KEY = 'yuseong_auth_token';
export const REFRESH_TOKEN_KEY = 'yuseong_refresh_token';

// 토큰 저장 함수
export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// 토큰 가져오기 함수
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

// 토큰 제거 함수 (로그아웃)
export const removeTokens = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// API 요청 시 사용할 기본 헤더
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 날짜 포맷팅 함수
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 민원 상태 한글화 함수
export const translateStatus = (status: string) => {
  switch (status) {
    case 'SUBMITTED':
      return '접수됨';
    case 'PROCESSING':
      return '처리중';
    case 'COMPLETED':
      return '처리완료';
    case 'REJECTED':
      return '반려';
    default:
      return '알 수 없음';
  }
};
