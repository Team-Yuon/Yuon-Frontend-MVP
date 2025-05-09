"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { MainBanner } from "@/components/main-banner"
import { ServiceCategories } from "@/components/service-categories"
import { PopularServices } from "@/components/popular-services"
import { Notices } from "@/components/notices"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // 인증 체크 - 로그인되지 않은 상태면 로그인 페이지로 리디렉션
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">로딩 중...</span>
      </div>
    );
  }

  // 로그인된 상태일 때만 메인 페이지 표시
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <MainBanner />
        <div className="kgds-container">
          <ServiceCategories />
          <PopularServices />
          <Notices />
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
