"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getNotices } from "@/lib/api"
import { formatDate } from "@/lib/apiUtils"

export function Notices() {
  const { toast } = useToast()
  const [notices, setNotices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNotices = async () => {
      setIsLoading(true)
      try {
        const response = await getNotices({ page: 1, limit: 4, isActive: true })
        setNotices(response.data || [])
      } catch (error) {
        console.error("공지사항 로딩 실패:", error)
        toast({
          title: "공지사항 로딩 실패",
          description: "공지사항 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadNotices()
  }, [toast])

  // 최근 7일 이내 공지사항인지 확인
  const isNewNotice = (dateString: string) => {
    const noticeDate = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - noticeDate.getTime()
    const diffDays = diffTime / (1000 * 3600 * 24)
    return diffDays <= 7
  }

  return (
    <section className="kgds-section">
      <Card className="kgds-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              공지사항
            </CardTitle>
            <Link href="/notices" className="text-primary flex items-center text-sm font-medium">
              더보기 <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-6 text-gray-500">공지사항이 없습니다.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notices.map((notice) => (
                <li key={notice.id} className="py-3">
                  <Link href={`/notices/${notice.id}`} className="flex justify-between items-center group">
                    <div className="flex items-center">
                      <span className="text-gray-900 group-hover:text-primary transition-colors">
                        {notice.title}
                      </span>
                      {isNewNotice(notice.createdAt) && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          NEW
                        </Badge>
                      )}
                      {notice.isImportant && (
                        <Badge className="ml-2 text-xs bg-amber-500">중요</Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(notice.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
