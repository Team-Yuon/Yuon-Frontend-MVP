'use client';

import { useState, useEffect } from 'react';
import { MainHeader } from '@/components/main-header';
import { MainFooter } from '@/components/main-footer';
import { Breadcrumb } from '@/components/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, CheckCircle, User, Calendar, 
  Building, Phone, Mail, ChevronLeft, ExternalLink,
  Tag, Clock, Download, MessageSquare, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  formatDate, formatSimpleDate, getStatusBadgeColor, 
  getStatusLabel, getFileIcon, isImageFile
} from '@/lib/utils';
import { complaintsAPI } from '@/lib/api';
import Image from 'next/image';

interface ComplaintDetailProps {
  params: {
    id: string;
  };
}

interface Complaint {
  id: string;
  title: string;
  content: string;
  status: string;
  category: {
    id: string;
    name: string;
  };
  department?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  attachments?: {
    id: string;
    filename: string;
    path: string;
    size: number;
    upload_date: string;
  }[];
  responses?: {
    id: string;
    content: string;
    created_at: string;
    user: {
      id: string;
      name: string;
      role: string;
    };
  }[];
}

export default function ComplaintDetailPage({ params }: ComplaintDetailProps) {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setIsLoading(true);
        const data = await complaintsAPI.getById(params.id);
        setComplaint(data);
      } catch (error) {
        console.error('민원 정보를 불러오는데 실패했습니다.', error);
        toast({
          title: '민원 상세 정보 로딩 실패',
          description: '민원 정보를 불러오는데 문제가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchComplaint();
    }
  }, [params.id, isAuthenticated, toast]);

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-grow">
          <div className="container mx-auto py-6 px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-2">민원 정보 로딩 중...</span>
            </div>
          </div>
        </main>
        <MainFooter />
      </div>
    );
  }

  // 민원이 없는 경우
  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-grow">
          <div className="container mx-auto py-6 px-4">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">민원을 찾을 수 없습니다</h2>
              <p className="text-gray-600 mb-6">요청하신 민원 정보를 찾을 수 없습니다.</p>
              <Button asChild>
                <Link href="/status">민원 목록으로 돌아가기</Link>
              </Button>
            </div>
          </div>
        </main>
        <MainFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="container mx-auto py-6 px-4">
          <Breadcrumb
            items={[
              { label: '홈', href: '/' },
              { label: '민원 조회', href: '/status' },
              { label: complaint.title, href: `/complaints/${complaint.id}` },
            ]}
          />
          
          <div className="flex flex-col md:flex-row justify-between items-start mt-6 mb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold">{complaint.title}</h1>
              <div className="flex items-center mt-2 text-gray-600 text-sm">
                <span className="mr-4 flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(complaint.created_at)}
                </span>
                <span className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  {complaint.user.name}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusBadgeColor(complaint.status)} border px-3 py-1 text-sm`}>
                {getStatusLabel(complaint.status)}
              </Badge>
              
              <Button variant="outline" size="sm" asChild>
                <Link href="/status">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  목록으로
                </Link>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="detail">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="detail">민원 상세</TabsTrigger>
              <TabsTrigger value="responses">처리 과정</TabsTrigger>
              <TabsTrigger value="attachments">첨부 파일</TabsTrigger>
            </TabsList>
            
            {/* 민원 상세 탭 */}
            <TabsContent value="detail">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                      {/* 민원 내용 */}
                      <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">민원 내용</h2>
                        <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-line">
                          {complaint.content}
                        </div>
                      </div>
                      
                      {/* 민원 정보 */}
                      <div>
                        <h2 className="text-lg font-semibold mb-4">민원 정보</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">카테고리</p>
                            <div className="flex items-center">
                              <Tag className="mr-2 h-4 w-4 text-primary" />
                              <span>{complaint.category.name}</span>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">현재 상태</p>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-primary" />
                              <span>{getStatusLabel(complaint.status)}</span>
                            </div>
                          </div>
                          
                          {complaint.department && (
                            <div className="border rounded-lg p-4">
                              <p className="text-sm text-gray-500 mb-1">담당 부서</p>
                              <div className="flex items-center">
                                <Building className="mr-2 h-4 w-4 text-primary" />
                                <Link 
                                  href={`/departments/${complaint.department.id}`}
                                  className="text-blue-600 hover:underline flex items-center"
                                >
                                  {complaint.department.name}
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          )}
                          
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">접수일</p>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-primary" />
                              <span>{formatSimpleDate(complaint.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 민원인 정보 */}
                    <div className="md:col-span-1">
                      <h2 className="text-lg font-semibold mb-4">민원인 정보</h2>
                      <Card className="bg-gray-50">
                        <CardContent className="p-4 space-y-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">이름</p>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-gray-500" />
                              <span>{complaint.user.name}</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 mb-1">이메일</p>
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4 text-gray-500" />
                              <span>{complaint.user.email}</span>
                            </div>
                          </div>
                          
                          {complaint.user.phone && (
                            <div>
                              <p className="text-sm text-gray-500 mb-1">연락처</p>
                              <div className="flex items-center">
                                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                                <span>{complaint.user.phone}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* 관리자 기능 */}
                      {(user?.role === 'ADMIN' || user?.role === 'DEPARTMENT_MANAGER') && (
                        <div className="mt-4">
                          <Button className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            답변 작성하기
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* 처리 과정 탭 */}
            <TabsContent value="responses">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">민원 처리 과정</h2>
                  
                  {complaint.responses && complaint.responses.length > 0 ? (
                    <div className="space-y-6">
                      {/* 최초 접수 */}
                      <div className="relative pl-8 pb-6 border-l-2 border-gray-200">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">민원 접수됨</h3>
                              <p className="text-sm text-gray-500">{formatDate(complaint.created_at)}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">접수</Badge>
                          </div>
                          <p className="text-gray-700">
                            민원이 성공적으로 접수되었습니다. 담당 부서에서 검토 후 처리할 예정입니다.
                          </p>
                        </div>
                      </div>
                      
                      {/* 응답 목록 */}
                      {complaint.responses.map((response, index) => (
                        <div 
                          key={response.id} 
                          className={`relative pl-8 ${
                            index < complaint.responses!.length - 1 ? 'pb-6 border-l-2 border-gray-200' : ''
                          }`}
                        >
                          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{response.user.name} ({response.user.role === 'ADMIN' ? '관리자' : '담당자'})</h3>
                                <p className="text-sm text-gray-500">{formatDate(response.created_at)}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200 border">처리</Badge>
                            </div>
                            <p className="text-gray-700 whitespace-pre-line">
                              {response.content}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* 완료 표시 (처리 완료인 경우만) */}
                      {complaint.status === 'COMPLETED' && (
                        <div className="relative pl-8">
                          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-600"></div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">민원 처리 완료</h3>
                                <p className="text-sm text-gray-500">{formatDate(complaint.updated_at)}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200 border">완료</Badge>
                            </div>
                            <p className="text-gray-700 flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              민원 처리가 완료되었습니다.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-2">아직 응답이 없습니다</p>
                      <p className="text-sm text-gray-500">담당 부서에서 검토 중입니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* 첨부 파일 탭 */}
            <TabsContent value="attachments">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">첨부 파일</h2>
                  
                  {complaint.attachments && complaint.attachments.length > 0 ? (
                    <div className="space-y-4">
                      {complaint.attachments.map((attachment) => (
                        <div key={attachment.id} className="border rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            {isImageFile(attachment.filename) ? (
                              <div className="mr-4 w-12 h-12 relative rounded overflow-hidden">
                                <Image 
                                  src={attachment.path} 
                                  alt={attachment.filename}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="mr-4 w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <FileText className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{attachment.filename}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(attachment.upload_date)}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={attachment.path} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              다운로드
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600">첨부 파일이 없습니다</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* 관련 민원 */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">관련 민원</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 mb-1">관련 민원이 없습니다</p>
                  <p className="text-xs text-gray-400">
                    AI가 분석한 결과 유사한 민원을 찾지 못했습니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}