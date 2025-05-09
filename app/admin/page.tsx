"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, BarChart2, PieChart, Activity, Users, FileText, Filter } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { getComplaintsStatistics } from "@/lib/api"
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
  LineChart,
  Line,
} from 'recharts'

// 차트 색상
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS = {
  SUBMITTED: '#FFBB28',  // 노랑
  PROCESSING: '#0088FE', // 파랑
  COMPLETED: '#00C49F',  // 초록
  REJECTED: '#FF8042'    // 주황
};

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [statistics, setStatistics] = useState<any | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [chartType, setChartType] = useState("day")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  // 인증 및 권한 체크
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user?.role !== 'ADMIN' && user?.role !== 'DEPARTMENT_MANAGER') {
        router.push('/')
        toast({
          title: "접근 권한 없음",
          description: "관리자 권한이 필요합니다.",
          variant: "destructive",
        })
      }
    }
  }, [isAuthenticated, isLoading, user, router, toast])

  // 통계 데이터 로딩
  useEffect(() => {
    const loadStatistics = async () => {
      setLoadingStats(true)
      try {
        const params = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          groupBy: chartType
        }
        
        const data = await getComplaintsStatistics(params)
        setStatistics(data)
      } catch (error) {
        console.error("통계 데이터 로딩 실패:", error)
        toast({
          title: "통계 데이터 로딩 실패",
          description: "통계 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setLoadingStats(false)
      }
    }

    if (isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'DEPARTMENT_MANAGER')) {
      loadStatistics()
    }
  }, [chartType, dateRange, isAuthenticated, user, toast])

  // 차트 타입 변경 핸들러
  const handleChartTypeChange = (value: string) => {
    setChartType(value)
  }

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 필터 적용 핸들러
  const applyFilters = () => {
    // 이미 useEffect에서 처리되므로 여기서는 특별한 작업 필요 없음
  }

  // 상태별 민원 수 데이터 (파이 차트용)
  const statusData = statistics ? [
    { name: '접수됨', value: statistics.submitted || 0 },
    { name: '처리중', value: statistics.processing || 0 },
    { name: '처리완료', value: statistics.completed || 0 },
    { name: '반려', value: statistics.rejected || 0 }
  ] : []

  if (isLoading || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-grow">
          <div className="kgds-container py-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-2">로딩 중...</span>
            </div>
          </div>
        </main>
        <MainFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "관리자 대시보드", href: "/admin" },
            ]}
          />
          <div className="mt-6">
            <h1 className="kgds-heading-1 mb-6">관리자 대시보드</h1>
            
            {/* 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="kgds-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">총 민원</p>
                      <h3 className="text-3xl font-bold mt-1">{statistics?.total || 0}</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="kgds-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">처리중</p>
                      <h3 className="text-3xl font-bold mt-1">{statistics?.processing || 0}</h3>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Activity className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="kgds-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">처리완료</p>
                      <h3 className="text-3xl font-bold mt-1">{statistics?.completed || 0}</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <BarChart2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="kgds-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">평균 처리 시간</p>
                      <h3 className="text-3xl font-bold mt-1">{statistics?.averageProcessingTime ? `${Math.round(statistics.averageProcessingTime)}시간` : '-'}</h3>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 필터 */}
            <Card className="kgds-card mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full sm:w-auto flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">시작 날짜</label>
                    <Input
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <div className="w-full sm:w-auto flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">종료 날짜</label>
                    <Input
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <div className="w-full sm:w-auto flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">그룹화</label>
                    <Select value={chartType} onValueChange={handleChartTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="그룹화 기준 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">일별</SelectItem>
                        <SelectItem value="week">주별</SelectItem>
                        <SelectItem value="month">월별</SelectItem>
                        <SelectItem value="category">카테고리별</SelectItem>
                        <SelectItem value="department">부서별</SelectItem>
                        <SelectItem value="status">상태별</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="min-w-[100px]" onClick={applyFilters}>
                    <Filter className="mr-2 h-4 w-4" />
                    필터 적용
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* 차트 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* 민원 추이 */}
              <Card className="kgds-card">
                <CardHeader>
                  <CardTitle>민원 추이</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="ml-2">로딩 중...</span>
                    </div>
                  ) : statistics && statistics.data && statistics.data.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={statistics.data}
                          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="label" 
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
                    <div className="flex justify-center items-center h-64 text-gray-500">
                      데이터가 없습니다.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* 민원 상태 분포 */}
              <Card className="kgds-card">
                <CardHeader>
                  <CardTitle>민원 상태 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="ml-2">로딩 중...</span>
                    </div>
                  ) : statusData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RPieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RPieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64 text-gray-500">
                      데이터가 없습니다.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* 관리자 안내 */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-600">관리자 대시보드 안내</AlertTitle>
              <AlertDescription className="text-blue-600">
                이 대시보드에서는 민원 통계 정보를 확인할 수 있습니다. 
                날짜 범위와 그룹화 기준을 선택하여 다양한 통계를 확인하세요.
                더 자세한 정보가 필요하면 관리자 메뉴의 다른 기능을 이용해주세요.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
