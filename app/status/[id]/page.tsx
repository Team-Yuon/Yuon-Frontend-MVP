"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ChevronLeft, Paperclip, Send } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { getComplaintById, addComplaintResponse, updateComplaintStatus } from "@/lib/api"
import { formatDate, translateStatus } from "@/lib/apiUtils"

interface ComplaintDetailPageProps {
  params: {
    id: string
  }
}

export default function ComplaintDetailPage({ params }: ComplaintDetailPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [complaint, setComplaint] = useState<any | null>(null)
  const [loadingComplaint, setLoadingComplaint] = useState(true)
  const [response, setResponse] = useState("")
  const [submittingResponse, setSubmittingResponse] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

  // 인증 체크
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // 민원 정보 로딩
  useEffect(() => {
    const loadComplaint = async () => {
      setLoadingComplaint(true)
      try {
        const data = await getComplaintById(params.id)
        setComplaint(data)
      } catch (error) {
        console.error("민원 정보 로딩 실패:", error)
        toast({
          title: "민원 정보 로딩 실패",
          description: "민원 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setLoadingComplaint(false)
      }
    }

    if (isAuthenticated) {
      loadComplaint()
    }
  }, [params.id, isAuthenticated, toast])

  // 응답 제출
  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      toast({
        title: "응답 내용 필요",
        description: "응답 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setSubmittingResponse(true)
    try {
      const responseData = await addComplaintResponse(params.id, response)
      
      // 민원 정보 업데이트
      setComplaint((prev: any) => ({
        ...prev,
        responses: [...prev.responses, responseData],
      }))
      
      setResponse("")
      toast({
        title: "응답 추가 완료",
        description: "민원 응답이 성공적으로 추가되었습니다.",
      })
    } catch (error) {
      console.error("응답 추가 실패:", error)
      toast({
        title: "응답 추가 실패",
        description: "민원 응답을 추가하는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setSubmittingResponse(false)
    }
  }

  // 상태 변경
  const handleStatusChange = async (newStatus: string) => {
    setChangingStatus(true)
    try {
      await updateComplaintStatus(params.id, newStatus)
      
      // 민원 정보 업데이트
      setComplaint((prev: any) => ({
        ...prev,
        status: newStatus,
      }))
      
      toast({
        title: "상태 변경 완료",
        description: `민원 상태가 '${translateStatus(newStatus)}'로 변경되었습니다.`,
      })
    } catch (error) {
      console.error("상태 변경 실패:", error)
      toast({
        title: "상태 변경 실패",
        description: "민원 상태를 변경하는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setChangingStatus(false)
    }
  }

  if (isLoading || loadingComplaint) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-grow">
          <div className="kgds-container py-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-2">로딩 중...</span>
            </div>
          </div>
        </main>
        <MainFooter />
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-grow">
          <div className="kgds-container py-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>민원 정보를 찾을 수 없습니다.</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                뒤로 가기
              </Button>
            </div>
          </div>
        </main>
        <MainFooter />
      </div>
    )
  }

  const isAdmin = user?.role === "ADMIN" || user?.role === "DEPARTMENT_MANAGER"

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "민원조회", href: "/status" },
              { label: "민원 상세", href: `/status/${params.id}` },
            ]}
          />

          <div className="mt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="kgds-heading-1 mb-2">{complaint.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <Badge
                    className={`kgds-badge ${
                      complaint.status === "PROCESSING"
                        ? "kgds-badge-blue"
                        : complaint.status === "COMPLETED"
                          ? "kgds-badge-green"
                          : complaint.status === "SUBMITTED"
                            ? "kgds-badge-yellow"
                            : "kgds-badge-red"
                    }`}
                  >
                    {translateStatus(complaint.status)}
                  </Badge>
                  <span>|</span>
                  <span>접수번호: {complaint.referenceNumber}</span>
                  <span>|</span>
                  <span>접수일: {formatDate(complaint.createdAt)}</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                목록으로
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="kgds-card mb-6">
                  <CardHeader>
                    <CardTitle>민원 내용</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{complaint.content}</p>
                    </div>

                    {complaint.attachments && complaint.attachments.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium mb-2">첨부파일</h3>
                        <div className="space-y-2">
                          {complaint.attachments.map((attachment: any) => (
                            <div key={attachment.id} className="flex items-center text-sm">
                              <Paperclip className="h-4 w-4 mr-2 text-gray-400" />
                              <a
                                href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/v1'}${attachment.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {attachment.filename}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="kgds-card">
                  <CardHeader>
                    <CardTitle>응답 및 처리내역</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {complaint.responses && complaint.responses.length > 0 ? (
                      <div className="space-y-4">
                        {complaint.responses.map((response: any) => (
                          <div key={response.id} className="bg-gray-50 p-4 rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">{response.respondedBy.name}</div>
                              <div className="text-sm text-gray-500">{formatDate(response.createdAt)}</div>
                            </div>
                            <p className="whitespace-pre-line text-gray-700">{response.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        아직 담당자의 응답이 없습니다.
                      </div>
                    )}

                    {isAdmin && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium mb-2">응답 작성</h3>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="민원에 대한 응답을 작성해주세요."
                            className="min-h-[120px]"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                          />
                          <div className="flex justify-end">
                            <Button
                              onClick={handleSubmitResponse}
                              disabled={submittingResponse || !response.trim()}
                            >
                              {submittingResponse ? (
                                <div className="flex items-center">
                                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                                  처리 중...
                                </div>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  응답 전송
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="kgds-card mb-6">
                  <CardHeader>
                    <CardTitle>민원 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">민원 분류</h3>
                        <p>{complaint.category?.name || "미분류"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">담당 부서</h3>
                        <p>{complaint.assignedTo?.department || complaint.aiVerification?.suggestedDepartment || "배정 전"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">처리 상태</h3>
                        <p>
                          <Badge
                            className={`kgds-badge ${
                              complaint.status === "PROCESSING"
                                ? "kgds-badge-blue"
                                : complaint.status === "COMPLETED"
                                  ? "kgds-badge-green"
                                  : complaint.status === "SUBMITTED"
                                    ? "kgds-badge-yellow"
                                    : "kgds-badge-red"
                            }`}
                          >
                            {translateStatus(complaint.status)}
                          </Badge>
                        </p>
                      </div>
                      {complaint.aiVerification && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">처리 예상 시간</h3>
                          <p>{complaint.aiVerification.estimatedProcessingTime || "3-5일"}</p>
                        </div>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium mb-2">상태 관리</h3>
                        <Tabs defaultValue={complaint.status}>
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="PROCESSING">처리중</TabsTrigger>
                            <TabsTrigger value="COMPLETED">처리완료</TabsTrigger>
                            <TabsTrigger value="REJECTED">반려</TabsTrigger>
                          </TabsList>
                          <div className="mt-4">
                            <Button
                              onClick={() => handleStatusChange(
                                complaint.status === "PROCESSING" ? "COMPLETED" : "PROCESSING"
                              )}
                              className="w-full"
                              disabled={changingStatus}
                            >
                              {changingStatus ? (
                                <div className="flex items-center">
                                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                                  처리 중...
                                </div>
                              ) : (
                                `${translateStatus(
                                  complaint.status === "PROCESSING" ? "COMPLETED" : "PROCESSING"
                                )}으로 변경`
                              )}
                            </Button>
                          </div>
                        </Tabs>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="kgds-card">
                  <CardHeader>
                    <CardTitle>민원인 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">이름</h3>
                        <p>{complaint.submittedBy?.name || "미상"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">이메일</h3>
                        <p>{complaint.submittedBy?.email || "미상"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">연락처</h3>
                        <p>{complaint.submittedBy?.phone || "미상"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
