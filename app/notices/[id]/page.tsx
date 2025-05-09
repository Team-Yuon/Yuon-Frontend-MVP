"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, AlertCircle, Calendar } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { getNoticeById } from "@/lib/api"
import { formatDate } from "@/lib/apiUtils"

interface NoticeDetailPageProps {
  params: {
    id: string
  }
}

export default function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, isLoading } = useAuth()
  const [notice, setNotice] = useState<any | null>(null)
  const [loadingNotice, setLoadingNotice] = useState(true)

  // 인증 체크
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // 공지사항 정보 로딩
  useEffect(() => {
    const loadNotice = async () => {
      setLoadingNotice(true)
      try {
        const data = await getNoticeById(params.id)
        setNotice(data)
      } catch (error) {
        console.error("공지사항 정보 로딩 실패:", error)
        toast({
          title: "공지사항 정보 로딩 실패",
          description: "공지사항 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setLoadingNotice(false)
      }
    }

    if (isAuthenticated) {
      loadNotice()
    }
  }, [params.id, isAuthenticated, toast])

  if (isLoading || loadingNotice) {
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

  if (!notice) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-grow">
          <div className="kgds-container py-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>공지사항 정보를 찾을 수 없습니다.</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                뒤로 가기
              </Button>
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
              { label: "공지사항", href: "/notices" },
              { label: "공지사항 상세", href: `/notices/${params.id}` },
            ]}
          />

          <div className="mt-6">
            <div className="flex justify-between items-start mb-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                목록으로
              </Button>
            </div>

            <Card className="kgds-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      {notice.isImportant && (
                        <Badge className="mr-2 bg-amber-500">중요</Badge>
                      )}
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{notice.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line">{notice.content}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
