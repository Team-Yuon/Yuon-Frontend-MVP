import { API_BASE_URL, getAuthHeader, saveTokens, removeTokens } from './apiUtils';

// 기본 API 요청 함수
const fetchApi = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });

  // 401 에러 시 새로고침 토큰으로 재시도
  if (response.status === 401) {
    try {
      const refreshed = await refreshToken();
      if (refreshed) {
        return fetchApi(url, options);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      // 재인증 실패 시 로그아웃
      removeTokens();
      window.location.href = '/login';
      throw error;
    }
  }

  // 응답이 JSON이 아닐 경우 처리
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    // 요청 실패 시 에러 처리
    if (!response.ok) {
      throw new Error(data.message || 'API 요청 실패');
    }
    
    return data;
  } else {
    if (!response.ok) {
      throw new Error('API 요청 실패');
    }
    return response.text();
  }
};

// 로그인 API
export const login = async (username: string, password: string) => {
  const response = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  
  if (response.accessToken && response.refreshToken) {
    saveTokens(response.accessToken, response.refreshToken);
  }
  
  return response;
};

// 토큰 새로고침 API
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('yuseong_refresh_token');
    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem('yuseong_auth_token', data.accessToken);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// 로그아웃
export const logout = () => {
  removeTokens();
};

// 카테고리 API
export const getCategories = async (parentId?: string) => {
  const query = parentId ? `?parentId=${parentId}` : '';
  return fetchApi(`/categories${query}`);
};

// 민원 API
export const getComplaints = async (params: any = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, String(value));
  });
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchApi(`/complaints${query}`);
};

export const getComplaintById = async (id: string) => {
  return fetchApi(`/complaints/${id}`);
};

export const createComplaint = async (formData: FormData) => {
  return fetch(`${API_BASE_URL}/complaints`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create complaint');
    }
    return response.json();
  });
};

export const updateComplaintStatus = async (id: string, status: string, comment?: string) => {
  return fetchApi(`/complaints/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, comment }),
  });
};

export const addComplaintResponse = async (id: string, content: string) => {
  return fetchApi(`/complaints/${id}/responses`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};

// AI 분석 API
export const analyzeComplaint = async (title: string, content: string) => {
  return fetchApi(`/ai/analyze`, {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
};

// 공지사항 API
export const getNotices = async (params: any = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryParams.append(key, String(value));
  });
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchApi(`/notices${query}`);
};

export const getNoticeById = async (id: string) => {
  return fetchApi(`/notices/${id}`);
};

// 통계 API
export const getComplaintsStatistics = async (params: any = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, String(value));
  });
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchApi(`/statistics/complaints${query}`);
};

export default {
  login,
  logout,
  refreshToken,
  getCategories,
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  addComplaintResponse,
  analyzeComplaint,
  getNotices,
  getNoticeById,
  getComplaintsStatistics,
};
