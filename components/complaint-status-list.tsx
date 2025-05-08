import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

type ComplaintStatus = "processing" | "completed" | "rejected"

interface ComplaintStatusListProps {
  status?: ComplaintStatus
}

const mockComplaints = [
  {
    id: "YS-2023-05082-1234",
    title: "아파트 층간소음 문제",
    category: "환경 > 소음공해",
    department: "환경관리과",
    date: "2023-05-08",
    status: "processing" as ComplaintStatus,
  },
  {
    id: "YS-2023-05075-5678",
    title: "도로 파손 신고",
    category: "교통 > 도로시설",
    department: "도로과",
    date: "2023-05-07",
    status: "completed" as ComplaintStatus,
  },
  {
    id: "YS-2023-05065-9012",
    title: "쓰레기 무단투기 신고",
    category: "환경 > 폐기물",
    department: "청소행정과",
    date: "2023-05-06",
    status: "completed" as ComplaintStatus,
  },
  {
    id: "YS-2023-05055-3456",
    title: "불법 주정차 신고",
    category: "교통 > 주차",
    department: "교통과",
    date: "2023-05-05",
    status: "rejected" as ComplaintStatus,
  },
]

export function ComplaintStatusList({ status }: ComplaintStatusListProps) {
  const filteredComplaints = status ? mockComplaints.filter((complaint) => complaint.status === status) : mockComplaints

  if (filteredComplaints.length === 0) {
    return (
      <Card className="kgds-card mt-4">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">조회된 민원이 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      {filteredComplaints.map((complaint) => (
        <Card key={complaint.id} className="kgds-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`kgds-badge ${
                      complaint.status === "processing"
                        ? "kgds-badge-blue"
                        : complaint.status === "completed"
                          ? "kgds-badge-green"
                          : "kgds-badge-red"
                    }`}
                  >
                    {complaint.status === "processing"
                      ? "처리중"
                      : complaint.status === "completed"
                        ? "처리완료"
                        : "반려"}
                  </Badge>
                  <span className="text-sm text-gray-500">{complaint.id}</span>
                </div>
                <h3 className="kgds-heading-3">{complaint.title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                  <span>{complaint.category}</span>
                  <span className="hidden sm:inline">|</span>
                  <span>{complaint.department}</span>
                  <span className="hidden sm:inline">|</span>
                  <span>접수일: {complaint.date}</span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm" className="flex items-center border-[#DFE4E8]">
                  <Link href={`/status/${complaint.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    상세보기
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
