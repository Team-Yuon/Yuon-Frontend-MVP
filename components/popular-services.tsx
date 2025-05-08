import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const popularServices = [
  {
    id: "noise",
    title: "층간소음 민원",
    description: "아파트 층간소음 관련 민원을 신청합니다.",
    href: "/complaints/noise",
  },
  {
    id: "parking",
    title: "불법주차 신고",
    description: "불법 주정차 차량에 대한 신고를 접수합니다.",
    href: "/complaints/parking",
  },
  {
    id: "garbage",
    title: "쓰레기 무단투기",
    description: "쓰레기 무단투기 관련 민원을 신청합니다.",
    href: "/complaints/garbage",
  },
  {
    id: "construction",
    title: "공사장 소음",
    description: "건설 공사장 소음 관련 민원을 신청합니다.",
    href: "/complaints/construction",
  },
]

export function PopularServices() {
  return (
    <section className="kgds-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="kgds-heading-1">자주 찾는 민원</h2>
        <Link href="/complaints/popular" className="text-primary flex items-center text-sm font-medium">
          더보기 <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularServices.map((service) => (
          <Link key={service.id} href={service.href}>
            <Card className="kgds-card h-full hover:border-primary transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
