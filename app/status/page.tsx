import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ComplaintStatusList } from "@/components/complaint-status-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function StatusPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "민원조회", href: "/status" },
            ]}
          />
          <div className="mt-6">
            <h1 className="kgds-heading-1 mb-6">민원 조회</h1>

            <Card className="kgds-card mb-6">
              <CardHeader className="pb-2">
                <CardTitle>민원 검색</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <Input placeholder="민원 접수번호 또는 제목을 입력하세요" className="kgds-input" />
                  </div>
                  <Button className="flex items-center bg-primary hover:bg-primary/90">
                    <Search className="mr-2 h-4 w-4" />
                    검색
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="processing">처리중</TabsTrigger>
                <TabsTrigger value="completed">처리완료</TabsTrigger>
                <TabsTrigger value="rejected">반려</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ComplaintStatusList />
              </TabsContent>
              <TabsContent value="processing">
                <ComplaintStatusList status="processing" />
              </TabsContent>
              <TabsContent value="completed">
                <ComplaintStatusList status="completed" />
              </TabsContent>
              <TabsContent value="rejected">
                <ComplaintStatusList status="rejected" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
