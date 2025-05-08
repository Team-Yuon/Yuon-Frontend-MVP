"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Upload, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const complaintCategories = [
  { value: "general", label: "일반 민원" },
  { value: "housing", label: "주택/건축" },
  { value: "business", label: "기업/창업" },
  { value: "education", label: "교육" },
  { value: "traffic", label: "교통/도로" },
  { value: "health", label: "보건/복지" },
  { value: "environment", label: "환경" },
  { value: "community", label: "지역사회" },
]

export function ComplaintForm() {
  const router = useRouter()
  const [formStep, setFormStep] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<null | {
    status: "success" | "info" | "warning"
    message: string
    suggestion?: string
  }>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formStep === 1) {
      setFormStep(2)
    } else if (formStep === 2) {
      // Simulate AI verification
      setIsVerifying(true)
      setTimeout(() => {
        setIsVerifying(false)
        setVerificationResult({
          status: "info",
          message: "민원 내용이 AI에 의해 분석되었습니다.",
          suggestion:
            "해당 민원은 '환경 > 소음공해' 카테고리로 분류되었으며, 관련 부서는 '환경관리과'입니다. 처리 예상 시간은 3-5일입니다.",
        })
        setFormStep(3)
      }, 2000)
    } else if (formStep === 3) {
      // Submit the form
      router.push("/complaints/confirmation")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="kgds-card mb-6">
        <CardContent className="p-6">
          {formStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="kgds-heading-2">민원인 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="kgds-label">
                      이름
                    </Label>
                    <Input id="name" placeholder="이름을 입력하세요" required className="kgds-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="kgds-label">
                      연락처
                    </Label>
                    <Input id="phone" placeholder="연락처를 입력하세요" required className="kgds-input" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="kgds-label">
                      이메일
                    </Label>
                    <Input id="email" type="email" placeholder="이메일을 입력하세요" required className="kgds-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="kgds-label">
                      주소
                    </Label>
                    <Input id="address" placeholder="주소를 입력하세요" className="kgds-input" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-600">개인정보 수집 및 이용 안내</AlertTitle>
                  <AlertDescription className="text-blue-600">
                    민원 처리를 위해 개인정보를 수집합니다. 수집된 정보는 민원 처리 목적으로만 사용되며, 처리 완료 후
                    관련 법령에 따라 보관됩니다.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="kgds-heading-2">민원 내용</h2>
                <div className="space-y-2">
                  <Label htmlFor="category" className="kgds-label">
                    민원 분류
                  </Label>
                  <Select required>
                    <SelectTrigger className="kgds-input">
                      <SelectValue placeholder="민원 분류를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {complaintCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="kgds-label">
                    제목
                  </Label>
                  <Input id="title" placeholder="민원 제목을 입력하세요" required className="kgds-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="kgds-label">
                    내용
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="민원 내용을 상세히 입력해주세요"
                    className="kgds-input min-h-[200px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file" className="kgds-label">
                    첨부파일
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" className="w-full border-gray-200">
                      <Upload className="mr-2 h-4 w-4" />
                      파일 첨부하기
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">최대 5개 파일, 파일당 10MB 이하 (jpg, png, pdf 형식 지원)</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm font-medium">민원 처리 절차 안내</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                        <li>민원 접수: 작성된 민원이 시스템에 접수됩니다.</li>
                        <li>AI 검증: AI가 민원 내용을 분석하여 적절한 부서로 분류합니다.</li>
                        <li>담당자 배정: 해당 부서의 담당자가 민원을 검토합니다.</li>
                        <li>처리 및 답변: 민원에 대한 처리 결과를 안내해 드립니다.</li>
                        <li>만족도 조사: 민원 처리 후 만족도 조사를 실시합니다.</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          )}

          {formStep === 3 && (
            <div className="space-y-6">
              <h2 className="kgds-heading-2">AI 검증 결과</h2>

              {verificationResult && (
                <Alert
                  className={`
                  ${verificationResult.status === "success" ? "bg-green-50 border-green-200" : ""}
                  ${verificationResult.status === "info" ? "bg-blue-50 border-blue-200" : ""}
                  ${verificationResult.status === "warning" ? "bg-yellow-50 border-yellow-200" : ""}
                `}
                >
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      verificationResult.status === "success"
                        ? "text-green-600"
                        : verificationResult.status === "info"
                          ? "text-blue-600"
                          : "text-yellow-600"
                    }`}
                  />
                  <AlertTitle
                    className={`
                    ${verificationResult.status === "success" ? "text-green-600" : ""}
                    ${verificationResult.status === "info" ? "text-blue-600" : ""}
                    ${verificationResult.status === "warning" ? "text-yellow-600" : ""}
                  `}
                  >
                    {verificationResult.message}
                  </AlertTitle>
                  {verificationResult.suggestion && (
                    <AlertDescription
                      className={`
                      ${verificationResult.status === "success" ? "text-green-600" : ""}
                      ${verificationResult.status === "info" ? "text-blue-600" : ""}
                      ${verificationResult.status === "warning" ? "text-yellow-600" : ""}
                    `}
                    >
                      {verificationResult.suggestion}
                    </AlertDescription>
                  )}
                </Alert>
              )}

              <div className="space-y-4 pt-4">
                <h3 className="kgds-heading-3">민원 최종 확인</h3>
                <Tabs defaultValue="summary">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">요약 정보</TabsTrigger>
                    <TabsTrigger value="detail">상세 정보</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="p-4 border border-gray-200 rounded-md mt-2">
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
                        <dt className="text-sm font-medium text-gray-500">처리 예상 시간:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">3-5일</dd>
                      </div>
                    </dl>
                  </TabsContent>
                  <TabsContent value="detail" className="p-4 border border-gray-200 rounded-md mt-2">
                    <dl className="space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">이름:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">홍길동</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">연락처:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">010-1234-5678</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">이메일:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">example@email.com</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">제목:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">아파트 층간소음 문제</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">내용:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          위층 아파트에서 발생하는 소음으로 인해 생활에 불편을 겪고 있습니다. 특히 밤 10시 이후에도
                          계속되는 소음으로 수면에 방해를 받고 있습니다.
                        </dd>
                      </div>
                    </dl>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-600">민원 제출 전 확인사항</AlertTitle>
                  <AlertDescription className="text-yellow-600">
                    제출된 민원은 취소가 불가능합니다. 내용을 다시 한번 확인해주세요.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        {formStep > 1 ? (
          <Button type="button" variant="outline" className="border-gray-200" onClick={() => setFormStep(formStep - 1)}>
            이전
          </Button>
        ) : (
          <div></div>
        )}

        {isVerifying ? (
          <Button disabled className="bg-primary">
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
              AI 검증 중...
            </div>
          </Button>
        ) : (
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            {formStep === 1 && "다음"}
            {formStep === 2 && "AI 검증"}
            {formStep === 3 && "민원 제출"}
          </Button>
        )}
      </div>

      {formStep < 3 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="kgds-heading-3">민원 처리 과정</h3>
            <span className="text-sm text-gray-500">{formStep}/3 단계</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(formStep / 3) * 100}%` }}></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs font-medium text-gray-700">정보 입력</span>
            <span className="text-xs font-medium text-gray-700">민원 작성</span>
            <span className="text-xs font-medium text-gray-700">AI 검증 및 제출</span>
          </div>
        </div>
      )}
    </form>
  )
}
