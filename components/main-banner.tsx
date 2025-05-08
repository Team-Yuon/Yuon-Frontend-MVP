import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MainBanner() {
  return (
    <div className="bg-primary text-white">
      <div className="kgds-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">유성구청 민원24</h1>
            <p className="text-lg md:text-xl mb-6">
              AI 기반 민원 처리 시스템으로 더 빠르고 정확한 민원 서비스를 경험하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-white text-primary hover:bg-gray-100 font-medium">
                <Link href="/complaints/new">민원 신청하기</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-primary/90">
                <Link href="/status">민원 조회하기</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="/korean-government-digital-services.png" alt="유성구청 민원 서비스" className="rounded-md shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
