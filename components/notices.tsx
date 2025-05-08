import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const notices = [
  {
    id: "notice1",
    title: "민원 시스템 개편 안내",
    date: "2023-05-01",
    isNew: true,
  },
  {
    id: "notice2",
    title: "5월 휴무일 안내",
    date: "2023-04-25",
    isNew: true,
  },
  {
    id: "notice3",
    title: "민원 접수 시간 변경 안내",
    date: "2023-04-15",
    isNew: false,
  },
  {
    id: "notice4",
    title: "온라인 민원 서비스 이용 방법",
    date: "2023-04-10",
    isNew: false,
  },
]

export function Notices() {
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
          <ul className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <li key={notice.id} className="py-3">
                <Link href={`/notices/${notice.id}`} className="flex justify-between items-center group">
                  <div className="flex items-center">
                    <span className="text-gray-900 group-hover:text-primary transition-colors">{notice.title}</span>
                    {notice.isNew && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        NEW
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{notice.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
