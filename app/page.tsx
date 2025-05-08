import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { MainBanner } from "@/components/main-banner"
import { ServiceCategories } from "@/components/service-categories"
import { PopularServices } from "@/components/popular-services"
import { Notices } from "@/components/notices"

export default function Home() {
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
  )
}
