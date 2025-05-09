import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 민원 상태 표시를 위한 유틸리티 함수
export function getStatusBadgeColor(status: string) {
  const colors = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
    DEFAULT: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return colors[status as keyof typeof colors] || colors.DEFAULT;
}

// 민원 상태 한글 변환
export function getStatusLabel(status: string) {
  const labels = {
    SUBMITTED: '접수됨',
    PROCESSING: '처리중',
    COMPLETED: '처리완료',
    REJECTED: '반려',
  };
  
  return labels[status as keyof typeof labels] || status;
}

// 날짜 형식 변환
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// 간단한 날짜 형식 변환
export function formatSimpleDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// 민원 카테고리 아이콘 가져오기
export function getCategoryIcon(categoryName: string) {
  // 실제 구현에서는 카테고리별 아이콘을 반환
  return '/icons/category-default.svg';
}

// 전화번호 형식 포맷팅
export function formatPhoneNumber(phoneNumber: string) {
  if (!phoneNumber) return '';
  
  // 기본 포맷: 010-1234-5678
  return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 경과 시간 계산
export function getElapsedTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const elapsed = now.getTime() - date.getTime();
  
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}일 전`;
  } else if (hours > 0) {
    return `${hours}시간 전`;
  } else if (minutes > 0) {
    return `${minutes}분 전`;
  } else {
    return '방금 전';
  }
}

// 민원 처리 시간 계산 (처리 완료된 민원에 한함)
export function getProcessingTime(createdAt: string, completedAt: string) {
  if (!completedAt) return '처리 중';
  
  const created = new Date(createdAt);
  const completed = new Date(completedAt);
  const elapsed = completed.getTime() - created.getTime();
  
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}일 ${hours % 24}시간`;
  } else if (hours > 0) {
    return `${hours}시간 ${minutes % 60}분`;
  } else {
    return `${minutes}분`;
  }
}

// 단축된 텍스트 생성
export function truncateText(text: string, maxLength: number) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
}

// 파일 확장자에 따른 아이콘 선택
export function getFileIcon(filename: string) {
  if (!filename) return 'file-text';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const iconMap: { [key: string]: string } = {
    pdf: 'file-pdf',
    doc: 'file-text',
    docx: 'file-text',
    xls: 'file-spreadsheet',
    xlsx: 'file-spreadsheet',
    ppt: 'file-presentation',
    pptx: 'file-presentation',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    zip: 'file-archive',
    rar: 'file-archive',
    txt: 'file-text',
  };
  
  return iconMap[extension as keyof typeof iconMap] || 'file';
}

// 첨부 파일 확장자가 이미지인지 확인
export function isImageFile(filename: string) {
  if (!filename) return false;
  
  const extension = filename.split('.').pop()?.toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  
  return imageExtensions.includes(extension || '');
}

// 랜덤 ID 생성 (임시 사용)
export function generateId() {
  return Math.random().toString(36).substring(2, 15);
}
