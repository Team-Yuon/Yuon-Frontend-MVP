import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { ComplaintForm } from "@/components/complaint-form"
import { Breadcrumb } from "@/components/breadcrumb"

export default function NewComplaintPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "민원신청", href: "/complaints" },
              { label: "새 민원 작성", href: "/complaints/new" },
            ]}
          />
          <div className="mt-6">
            <h1 className="kgds-heading-1 mb-6">민원 신청</h1>
            <ComplaintForm />
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
