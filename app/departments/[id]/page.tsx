'use client';

import { useEffect, useState } from 'react';
import { MainHeader } from '@/components/main-header';
import { MainFooter } from '@/components/main-footer';
import { Breadcrumb } from '@/components/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, Mail, User, MapPin, FileText, 
  ChevronRight, Building, BarChart2, Info 
} from 'lucide-react';
import Link from 'next/link';
import { departmentsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RPieChart,
  Pie,
  Cell,
} from 'recharts';

// 차트 색상
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface DepartmentDetailProps {
  params: {
    id: string;
  };
}

interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  location: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  head_name: string | null;
  parent_department_id: string | null;
  subDepartments: Department[];
  categories: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
  }[];
}

interface DepartmentStats {
  statusStats: { status: string; count: number }[];
  categoryStats: { id: string; name: string; count: number }[];
  monthlyStats: { month: string; count: number }[];
}

export default function DepartmentDetailPage({ params }: DepartmentDetailProps) {
  const [department, setDepartment] = useState<Department | null>(null);
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setIsLoading(true);
        const data = await departmentsAPI.getById(params.id);
        setDepartment(data);
      } catch (error) {
        console.error('부서 정보를 불러오는데 실패했습니다.', error);
        toast({
          title: '부서 정보 로딩 실패',
          description: '부서 상세 정보를 불러오는데 문제가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartment();
  }, [params.id, toast]);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsStatsLoading(true);
        const data = await departmentsAPI.getDepartmentStats(params.id);
        setStats(data);
      } catch (error) {
        console.error('부서 통계를 불러오는데 실패했습니다.', error);
        toast({
          title: '통계 정보 로딩 실패',
          description: '부서 통계 정보를 불러오는데 문제가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsStatsLoading(false);
      }
    };

    if (department) {
      fetchStats();
    }
  }, [department, params.id, toast]);

  // 상태 이름 변환 함수
  const getStatusName = (status: string) => {
    const statusNames: { [key: string]: string } = {
      'SUBMITTED': '접수됨',
      'PROCESSING': '처리중',
      'COMPLETED': '처리완료',
      'REJECTED': '반려'
    };
    return statusNames[status] || status;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-2">부서 정보 로딩 중...</span>
            </div>
          ) : department ? (
            <>
              <Breadcrumb
                items={[
                  { label: '홈', href: '/' },
                  { label: '부서 안내', href: '/departments' },
                  { label: department.name, href: `/departments/${department.id}` },
                ]}
              />
              
              <div className="mt-6">
                <h1 className="kgds-heading-1 mb-6">{department.name}</h1>
                
                <Tabs defaultValue="info">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="info">부서 정보</TabsTrigger>
                    <TabsTrigger value="organization">조직 구성</TabsTrigger>
                    <TabsTrigger value="stats">민원 통계</TabsTrigger>
                  </TabsList>
                  
                  {/* 부서 정보 탭 */}
                  <TabsContent value="info">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-2/3">
                            <h2 className="text-xl font-bold mb-4">부서 소개</h2>
                            {department.description ? (
                              <p className="text-gray-700 whitespace-pre-line">{department.description}</p>
                            ) : (
                              <p className="text-gray-500 italic">부서 소개가 없습니다.</p>
                            )}
                            
                            <h2 className="text-xl font-bold mt-8 mb-4">담당 업무</h2>
                            {department.categories && department.categories.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {department.categories.map((category) => (
                                  <div key={category.id} className="flex items-start">
                                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                                      {category.icon ? (
                                        <Image 
                                          src={category.icon} 
                                          alt={category.name} 
                                          width={24} 
                                          height={24} 
                                        />
                                      ) : (
                                        <FileText size={24} className="text-gray-500" />
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="font-medium">{category.name}</h3>
                                      {category.description && (
                                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">담당 업무 정보가 없습니다.</p>
                            )}
                          </div>
                          
                          <div className="w-full md:w-1/3 bg-gray-50 p-5 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">연락처 정보</h2>
                            <div className="space-y-4">
                              {department.location && (
                                <div className="flex">
                                  <MapPin size={20} className="mr-3 text-gray-500 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">위치</p>
                                    <p>{department.location}</p>
                                  </div>
                                </div>
                              )}
                              
                              {department.contact_phone && (
                                <div className="flex">
                                  <Phone size={20} className="mr-3 text-gray-500 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">전화번호</p>
                                    <p>{department.contact_phone}</p>
                                  </div>
                                </div>
                              )}
                              
                              {department.contact_email && (
                                <div className="flex">
                                  <Mail size={20} className="mr-3 text-gray-500 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">이메일</p>
                                    <p>{department.contact_email}</p>
                                  </div>
                                </div>
                              )}
                              
                              {department.head_name && (
                                <div className="flex">
                                  <User size={20} className="mr-3 text-gray-500 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">부서장</p>
                                    <p>{department.head_name}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-8">
                              <Button className="w-full">
                                민원 작성하기
                                <ChevronRight size={16} className="ml-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* 조직 구성 탭 */}
                  <TabsContent value="organization">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">조직 구성</h2>
                        
                        {department.parent_department_id && (
                          <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">상위 부서</h3>
                            <Card className="bg-gray-50">
                              <CardContent className="p-4">
                                <p className="font-medium text-primary">상위 부서 정보</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  상위 부서 정보는 해당 부서 페이지에서 확인할 수 있습니다.
                                </p>
                                <Button variant="outline" size="sm" className="mt-3" asChild>
                                  <Link href={`/departments/${department.parent_department_id}`}>
                                    상위 부서 보기
                                    <ChevronRight size={16} className="ml-1" />
                                  </Link>
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                        
                        <h3 className="text-lg font-medium mb-3">
                          {department.subDepartments && department.subDepartments.length > 0
                            ? '하위 부서'
                            : '하위 부서 없음'}
                        </h3>
                        
                        {department.subDepartments && department.subDepartments.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {department.subDepartments.map((subDept) => (
                              <Link href={`/departments/${subDept.id}`} key={subDept.id}>
                                <Card className="hover:shadow-md transition-shadow">
                                  <CardContent className="p-4">
                                    <div className="flex items-start">
                                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <Building size={20} className="text-blue-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{subDept.name}</h4>
                                        {subDept.description && (
                                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {subDept.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">이 부서에는 하위 부서가 없습니다.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* 민원 통계 탭 */}
                  <TabsContent value="stats">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">민원 통계</h2>
                        
                        {isStatsLoading ? (
                          <div className="flex justify-center items-center h-64">
                            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                            <span className="ml-2">통계 정보 로딩 중...</span>
                          </div>
                        ) : stats ? (
                          <div className="space-y-8">
                            {/* 상태별 민원 수 */}
                            <div>
                              <h3 className="text-lg font-medium mb-3">상태별 민원 수</h3>
                              {stats.statusStats && stats.statusStats.length > 0 ? (
                                <div className="h-80">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <RPieChart>
                                      <Pie
                                        data={stats.statusStats.map(item => ({
                                          name: getStatusName(item.status),
                                          value: item.count
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, percent }) => 
                                          `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        {stats.statusStats.map((_, index) => (
                                          <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                          />
                                        ))}
                                      </Pie>
                                      <Tooltip />
                                      <Legend />
                                    </RPieChart>
                                  </ResponsiveContainer>
                                </div>
                              ) : (
                                <p className="text-gray-500">통계 데이터가 없습니다.</p>
                              )}
                            </div>
                            
                            {/* 카테고리별 민원 수 */}
                            <div>
                              <h3 className="text-lg font-medium mb-3">카테고리별 민원 수</h3>
                              {stats.categoryStats && stats.categoryStats.length > 0 ? (
                                <div className="h-80">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={stats.categoryStats}
                                      margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 40,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis 
                                        dataKey="name" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        tick={{ fontSize: 12 }} 
                                        height={70} 
                                      />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Bar dataKey="count" fill="#8884d8" name="민원 수" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              ) : (
                                <p className="text-gray-500">통계 데이터가 없습니다.</p>
                              )}
                            </div>
                            
                            {/* 월별 민원 추이 */}
                            <div>
                              <h3 className="text-lg font-medium mb-3">월별 민원 추이 (최근 6개월)</h3>
                              {stats.monthlyStats && stats.monthlyStats.length > 0 ? (
                                <div className="h-80">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={stats.monthlyStats}
                                      margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="month" />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Bar dataKey="count" fill="#0088FE" name="민원 수" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              ) : (
                                <p className="text-gray-500">통계 데이터가 없습니다.</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 p-4 rounded-lg flex items-start">
                            <Info className="text-yellow-500 mr-3 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-yellow-700">통계 정보를 불러올 수 없습니다.</p>
                              <p className="text-sm text-yellow-600 mt-1">
                                부서 통계 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-3 text-yellow-700" 
                                onClick={() => window.location.reload()}
                              >
                                새로고침
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">부서를 찾을 수 없습니다</h2>
              <p className="text-gray-600 mb-6">요청하신 부서 정보를 찾을 수 없습니다.</p>
              <Button asChild>
                <Link href="/departments">부서 목록으로 돌아가기</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <MainFooter />
    </div>
  );
}