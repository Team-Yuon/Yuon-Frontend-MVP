"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function ConfirmationPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // 인증 체크
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "민원신청", href: "/complaints" },
              { label: "민원 접수 완료", href: "/complaints/confirmation" },
            ]}
          />
          <div className="mt-6 max-w-2xl mx-auto">
            <Card className="kgds-card">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">민원 접수가 완료되었습니다</h1>
                <p className="text-gray-600 mb-6">
                  민원이 성공적으로 접수되었습니다. 담당 부서에서 검토 후 처리 결과를 안내해 드립니다.
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-gray-500 mb-1">접수된 민원은 '민원조회' 메뉴에서 확인할 수 있습니다.</p>
                  <p className="text-sm text-gray-500">
                    처리 상황은 이메일과 알림을 통해 안내해드립니다.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/status">
                      민원 조회하기
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/">
                      홈으로 이동
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
