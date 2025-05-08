import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, FileText, Home } from "lucide-react"
import Link from "next/link"

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "민원신청", href: "/complaints" },
              { label: "접수 완료", href: "/complaints/confirmation" },
            ]}
          />
          <div className="mt-6 max-w-2xl mx-auto">
            <Card className="kgds-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="kgds-heading-1 mb-2">민원이 접수되었습니다</h1>
                <p className="text-gray-600 mb-6">
                  접수번호: <span className="font-medium">YS-2023-05082-1234</span>
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h2 className="kgds-heading-3 mb-2">민원 정보</h2>
                  <dl className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-gray-500">민원 분류:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">환경 &gt; 소음공해</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-gray-500">담당 부서:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">환경관리과</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-gray-500">접수일:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">2023년 5월 8일</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-gray-500">처리 예상 시간:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">3-5일</dd>
                    </div>
                  </dl>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  민원 처리 상황은 '민원조회' 메뉴에서 확인하실 수 있습니다. 처리 결과는 입력하신 연락처로도 안내됩니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" className="flex items-center border-gray-200">
                    <Link href="/status">
                      <FileText className="mr-2 h-4 w-4" />
                      민원조회
                    </Link>
                  </Button>
                  <Button asChild className="flex items-center bg-primary hover:bg-primary/90">
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      홈으로
                    </Link>
                  </Button>
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
