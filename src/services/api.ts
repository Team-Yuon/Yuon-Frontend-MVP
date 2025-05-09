import { getAuthHeader, getToken, removeToken, setToken } from '@/utils/apiUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

// 인증 관련 API
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다');
      }

      const data = await response.json();
      setToken(data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    removeToken();
  },
  
  register: async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  checkAuth: async () => {
    try {
      const token = getToken();
      if (!token) return null;
      
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        removeToken();
        throw new Error('인증에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Check auth error:', error);
      removeToken();
      return null;
    }
  },
  
  updateProfile: async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error('비밀번호 변경에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },
};

// 민원 관련 API
export const complaintsAPI = {
  getAll: async (status?: string, page = 1, limit = 10) => {
    try {
      let url = `${API_URL}/complaints?page=${page}&limit=${limit}`;
      if (status && status !== 'ALL') {
        url += `&status=${status}`;
      }
      
      const response = await fetch(url, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('민원 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get complaints error:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/complaints/${id}`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('민원을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get complaint error:', error);
      throw error;
    }
  },
  
  create: async (complaintData: any) => {
    try {
      // 파일 업로드가 있는 경우 FormData 사용
      const formData = new FormData();
      
      // JSON 데이터를 FormData에 추가
      Object.keys(complaintData).forEach(key => {
        if (key !== 'attachments') {
          formData.append(key, 
            typeof complaintData[key] === 'object' 
              ? JSON.stringify(complaintData[key]) 
              : complaintData[key]
          );
        }
      });
      
      // 첨부 파일 추가
      if (complaintData.attachments && complaintData.attachments.length > 0) {
        complaintData.attachments.forEach((file: File, index: number) => {
          formData.append(`attachment${index}`, file);
        });
      }
      
      const response = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error('민원 접수에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Create complaint error:', error);
      throw error;
    }
  },
  
  update: async (id: string, updateData: any) => {
    try {
      const response = await fetch(`${API_URL}/complaints/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('민원 업데이트에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Update complaint error:', error);
      throw error;
    }
  },
  
  updateStatus: async (id: string, status: string, comment?: string) => {
    try {
      const response = await fetch(`${API_URL}/complaints/${id}/status`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, comment }),
      });

      if (!response.ok) {
        throw new Error('민원 상태 업데이트에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Update complaint status error:', error);
      throw error;
    }
  },
  
  addResponse: async (id: string, responseData: any) => {
    try {
      const response = await fetch(`${API_URL}/complaints/${id}/responses`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });

      if (!response.ok) {
        throw new Error('민원 응답 추가에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Add complaint response error:', error);
      throw error;
    }
  },
  
  deleteAttachment: async (id: string, attachmentId: string) => {
    try {
      const response = await fetch(`${API_URL}/complaints/${id}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('첨부 파일 삭제에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete attachment error:', error);
      throw error;
    }
  },
};

// 카테고리 관련 API
export const categoriesAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('카테고리 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('카테고리를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get category error:', error);
      throw error;
    }
  },
  
  create: async (categoryData: any) => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('카테고리 생성에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },
  
  update: async (id: string, categoryData: any) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('카테고리 업데이트에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('카테고리 삭제에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  },
};

// 공지사항 관련 API
export const noticesAPI = {
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_URL}/notices?page=${page}&limit=${limit}`);

      if (!response.ok) {
        throw new Error('공지사항 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get notices error:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/notices/${id}`);

      if (!response.ok) {
        throw new Error('공지사항을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get notice error:', error);
      throw error;
    }
  },
  
  create: async (noticeData: any) => {
    try {
      const response = await fetch(`${API_URL}/notices`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticeData),
      });

      if (!response.ok) {
        throw new Error('공지사항 생성에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Create notice error:', error);
      throw error;
    }
  },
  
  update: async (id: string, noticeData: any) => {
    try {
      const response = await fetch(`${API_URL}/notices/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticeData),
      });

      if (!response.ok) {
        throw new Error('공지사항 업데이트에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Update notice error:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/notices/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('공지사항 삭제에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete notice error:', error);
      throw error;
    }
  },
};

// AI 관련 API
export const aiAPI = {
  analyzeComplaint: async (content: string) => {
    try {
      const response = await fetch(`${API_URL}/ai/analyze-complaint`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('AI 분석에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('AI analyze error:', error);
      throw error;
    }
  },
  
  getSimilarComplaints: async (content: string) => {
    try {
      const response = await fetch(`${API_URL}/ai/similar-complaints`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('유사 민원 검색에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get similar complaints error:', error);
      throw error;
    }
  },
};

// 통계 관련 API
export const statsAPI = {
  getOverview: async () => {
    try {
      const response = await fetch(`${API_URL}/stats/overview`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('통계 정보를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get stats overview error:', error);
      throw error;
    }
  },
  
  getByCategory: async () => {
    try {
      const response = await fetch(`${API_URL}/stats/by-category`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('카테고리별 통계를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get stats by category error:', error);
      throw error;
    }
  },
  
  getByStatus: async () => {
    try {
      const response = await fetch(`${API_URL}/stats/by-status`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('상태별 통계를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get stats by status error:', error);
      throw error;
    }
  },
  
  getByDate: async (startDate: string, endDate: string) => {
    try {
      const response = await fetch(
        `${API_URL}/stats/by-date?startDate=${startDate}&endDate=${endDate}`, 
        {
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error('날짜별 통계를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get stats by date error:', error);
      throw error;
    }
  },
  
  getProcessingTime: async () => {
    try {
      const response = await fetch(`${API_URL}/stats/processing-time`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('처리 시간 통계를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get processing time stats error:', error);
      throw error;
    }
  },
};

// 부서 관련 API
export const departmentsAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/departments`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('부서 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get departments error:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/departments/${id}`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('부서 정보를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get department error:', error);
      throw error;
    }
  },
};

// FAQ 관련 API
export const faqAPI = {
  getAll: async (category?: string) => {
    try {
      let url = `${API_URL}/faqs`;
      if (category) {
        url += `?category=${category}`;
      }
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('FAQ 목록을 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get FAQs error:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/faqs/${id}`);

      if (!response.ok) {
        throw new Error('FAQ를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Get FAQ error:', error);
      throw error;
    }
  },
  
  create: async (faqData: any) => {
    try {
      const response = await fetch(`${API_URL}/faqs`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData),
      });

      if (!response.ok) {
        throw new Error('FAQ 생성에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Create FAQ error:', error);
      throw error;
    }
  },
  
  update: async (id: string, faqData: any) => {
    try {
      const response = await fetch(`${API_URL}/faqs/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData),
      });

      if (!response.ok) {
        throw new Error('FAQ 업데이트에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Update FAQ error:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/faqs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('FAQ 삭제에 실패했습니다');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete FAQ error:', error);
      throw error;
    }
  },
};
