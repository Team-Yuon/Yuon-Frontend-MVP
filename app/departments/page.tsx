'use client';

import { useEffect, useState } from 'react';
import { MainHeader } from '@/components/main-header';
import { MainFooter } from '@/components/main-footer';
import { Breadcrumb } from '@/components/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Phone, Mail, User, MapPin } from 'lucide-react';
import Link from 'next/link';
import { departmentsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  location: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  head_name: string | null;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const data = await departmentsAPI.getAll();
        setDepartments(data);
        setFilteredDepartments(data);
      } catch (error) {
        console.error('부서 목록을 불러오는데 실패했습니다.', error);
        toast({
          title: '부서 목록 로딩 실패',
          description: '부서 정보를 불러오는데 문제가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (dept.description && dept.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredDepartments(filtered);
    }
  }, [searchQuery, departments]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: '홈', href: '/' },
              { label: '부서 안내', href: '/departments' },
            ]}
          />
          
          <div className="mt-6">
            <h1 className="kgds-heading-1 mb-6">유성구청 부서 안내</h1>
            
            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="부서명 또는 업무 내용 검색"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-2">부서 정보 로딩 중...</span>
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">검색 결과가 없습니다.</p>
                <p className="text-sm text-gray-500 mt-2">다른 키워드로 검색해보세요.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                  전체 부서 보기
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map((department) => (
                  <Link href={`/departments/${department.id}`} key={department.id}>
                    <Card className="transition-all hover:shadow-md h-full">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold">{department.name}</h3>
                        {department.description && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{department.description}</p>
                        )}
                        <div className="mt-4 space-y-2">
                          {department.location && (
                            <div className="flex text-sm text-gray-500">
                              <MapPin size={16} className="mr-2 flex-shrink-0" />
                              <span>{department.location}</span>
                            </div>
                          )}
                          {department.contact_phone && (
                            <div className="flex text-sm text-gray-500">
                              <Phone size={16} className="mr-2 flex-shrink-0" />
                              <span>{department.contact_phone}</span>
                            </div>
                          )}
                          {department.head_name && (
                            <div className="flex text-sm text-gray-500">
                              <User size={16} className="mr-2 flex-shrink-0" />
                              <span>{department.head_name} 부서장</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}