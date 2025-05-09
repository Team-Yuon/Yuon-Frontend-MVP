"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Bell, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { getNotices } from "@/lib/api"
import { formatDate } from "@/lib/apiUtils"

export default function NoticesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, isLoading } = useAuth()
  const [notices, setNotices] = useState<any[]>([])
  const [loadingNotices, setLoadingNotices] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // 인증 체크
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // 공지사항 목록 로딩
  useEffect(() => {
    const loadNotices = async () => {
      setLoadingNotices(true)
      try {
        const params: any = { 
          page, 
          limit: 10,
          isActive: true
        }
        
        const response = await getNotices(params)
        setNotices(response.data || [])
        setTotalPages(response.pagination?.pages || 1)
      } catch (error) {
        console.error("공지사항 목록 로딩 실패:", error)
        toast({
          title: "공지사항 목록 로딩 실패",
          description: "공지사항 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setLoadingNotices(false)
      }
    }

    if (isAuthenticated) {
      loadNotices()
    }
  }, [page, isAuthenticated, toast])

  // 최근 7일 이내 공지사항인지 확인
  const isNewNotice = (dateString: string) => {
    const noticeDate = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - noticeDate.getTime()
    const diffDays = diffTime / (1000 * 3600 * 24)
    return diffDays <= 7
  }

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기서 검색 로직 구현 (API 연동 필요)
    setPage(1)
  }

  // 필터링된 공지사항 (클라이언트 사이드 검색)
  const filteredNotices = searchQuery.trim() === ""
    ? notices
    : notices.filter(notice => 
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        notice.content.toLowerCase().includes(searchQuery.toLowerCase())
      )

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "공지사항", href: "/notices" },
            ]}
          />
          <div className="mt-6">
            <h1 className="kgds-heading-1 mb-6">공지사항</h1>
            
            {/* 검색 바 */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="공지사항 검색"
                  className="pl-10 pr-4 py-2 border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3">
                  검색
                </Button>
              </div>
            </form>
            
            {/* 공지사항 목록 */}
            <Card className="kgds-card">
              <CardContent className="p-0">
                {loadingNotices ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span className="ml-2">로딩 중...</span>
                  </div>
                ) : filteredNotices.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    공지사항이 없습니다.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredNotices.map((notice) => (
                      <li key={notice.id} className="hover:bg-gray-50">
                        <Link href={`/notices/${notice.id}`} className="block p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <div className="flex items-center mb-1">
                                {notice.isImportant && (
                                  <Badge className="mr-2 bg-amber-500">중요</Badge>
                                )}
                                {isNewNotice(notice.createdAt) && (
                                  <Badge variant="destructive" className="mr-2 text-xs">NEW</Badge>
                                )}
                              </div>
                              <h2 className="text-lg font-medium text-gray-900 group-hover:text-primary">
                                {notice.title}
                              </h2>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {notice.content}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 md:text-right mt-2 md:mt-0">
                              {formatDate(notice.createdAt)}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            
            {/* 페이지네이션 */}
            {!loadingNotices && filteredNotices.length > 0 && (
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md">
                    <span>{page} / {totalPages}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
