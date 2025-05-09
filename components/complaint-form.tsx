"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Upload, CheckCircle2, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { getCategories, createComplaint, analyzeComplaint } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export function ComplaintForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [formStep, setFormStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    categoryId: "",
    title: "",
    content: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [verificationResult, setVerificationResult] = useState<any | null>(null)

  // 카테고리 목록 로딩
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("카테고리 로딩 실패:", error);
        toast({
          title: "카테고리 로딩 실패",
          description: "카테고리 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    };

    loadCategories();
  }, [toast]);

  // 로그인한 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, categoryId: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 5) {
        toast({
          title: "파일 개수 초과",
          description: "최대 5개까지 파일을 첨부할 수 있습니다.",
          variant: "destructive",
        });
        return;
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 1) {
      // 1단계 - 민원인 정보 검증
      if (!formData.name || !formData.phone || !formData.email) {
        toast({
          title: "필수 정보 누락",
          description: "이름, 연락처, 이메일은 필수 입력 항목입니다.",
          variant: "destructive",
        });
        return;
      }
      setFormStep(2);
    } else if (formStep === 2) {
      // 2단계 - 민원 내용 검증 및 AI 분석
      if (!formData.categoryId || !formData.title || !formData.content) {
        toast({
          title: "필수 정보 누락",
          description: "민원 분류, 제목, 내용은 필수 입력 항목입니다.",
          variant: "destructive",
        });
        return;
      }

      // AI 검증 실행
      setIsVerifying(true);
      try {
        const result = await analyzeComplaint(formData.title, formData.content);
        setVerificationResult(result);
        setFormStep(3);
      } catch (error) {
        console.error("AI 분석 실패:", error);
        toast({
          title: "AI 분석 실패",
          description: "민원 내용을 분석하는데 실패했습니다. 다시 시도해 주세요.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    } else if (formStep === 3) {
      // 3단계 - 민원 최종 제출
      setIsLoading(true);
      try {
        const submitFormData = new FormData();
        
        // 민원인 정보 추가
        submitFormData.append("title", formData.title);
        submitFormData.append("content", formData.content);
        submitFormData.append("categoryId", formData.categoryId);
        
        // 첨부 파일 추가
        files.forEach((file) => {
          submitFormData.append("attachments", file);
        });
        
        // 민원 제출
        const response = await createComplaint(submitFormData);
        
        toast({
          title: "민원 접수 완료",
          description: `민원번호 ${response.referenceNumber}로 접수되었습니다.`,
        });
        
        // 확인 페이지로 이동
        router.push("/complaints/confirmation");
      } catch (error) {
        console.error("민원 제출 실패:", error);
        toast({
          title: "민원 제출 실패",
          description: "민원을 제출하는 중 오류가 발생했습니다. 다시 시도해 주세요.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 선택된 카테고리 이름 찾기
  const findCategoryName = (id: string): string => {
    for (const category of categories) {
      if (category.id === id) {
        return category.name;
      }
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          if (subCategory.id === id) {
            return `${category.name} > ${subCategory.name}`;
          }
        }
      }
    }
    return "";
  };

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
                    <Input
                      id="name"
                      placeholder="이름을 입력하세요"
                      required
                      className="kgds-input"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="kgds-label">
                      연락처
                    </Label>
                    <Input
                      id="phone"
                      placeholder="연락처를 입력하세요"
                      required
                      className="kgds-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="kgds-label">
                      이메일
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      required
                      className="kgds-input"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="kgds-label">
                      주소
                    </Label>
                    <Input
                      id="address"
                      placeholder="주소를 입력하세요"
                      className="kgds-input"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
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
                  <Select 
                    required 
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="kgds-input">
                      <SelectValue placeholder="민원 분류를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="kgds-label">
                    제목
                  </Label>
                  <Input 
                    id="title" 
                    placeholder="민원 제목을 입력하세요" 
                    required 
                    className="kgds-input" 
                    value={formData.title}
                    onChange={handleInputChange}
                  />
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
                    value={formData.content}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file" className="kgds-label">
                    첨부파일
                  </Label>
                  <div className="flex items-center gap-2">
                    <label className="w-full">
                      <Button type="button" variant="outline" className="w-full border-gray-200" asChild>
                        <div>
                          <Upload className="mr-2 h-4 w-4" />
                          파일 첨부하기
                          <Input 
                            id="file" 
                            type="file" 
                            className="hidden" 
                            multiple 
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" 
                          />
                        </div>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">최대 5개 파일, 파일당 10MB 이하 (jpg, png, pdf 형식 지원)</p>
                  
                  {files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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

          {formStep === 3 && verificationResult && (
            <div className="space-y-6">
              <h2 className="kgds-heading-2">AI 검증 결과</h2>

              <Alert className="bg-blue-50 border-blue-200">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-600">
                  {verificationResult.result || "민원 내용이 AI에 의해 분석되었습니다."}
                </AlertTitle>
                <AlertDescription className="text-blue-600">
                  {`해당 민원은 '${verificationResult.suggestedCategory?.name || "일반 민원"}' 카테고리로 분류되었으며, 관련 부서는 '${verificationResult.suggestedDepartment?.name || "민원실"}'입니다. 처리 예상 시간은 ${verificationResult.estimatedProcessingTime || "3-5일"}입니다.`}
                </AlertDescription>
              </Alert>

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
                        <dd className="text-sm text-gray-900 col-span-2">
                          {findCategoryName(formData.categoryId) || verificationResult.suggestedCategory?.name || "일반 민원"}
                        </dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">담당 부서:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {verificationResult.suggestedDepartment?.name || "민원실"}
                        </dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">처리 예상 시간:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {verificationResult.estimatedProcessingTime || "3-5일"}
                        </dd>
                      </div>
                    </dl>
                  </TabsContent>
                  <TabsContent value="detail" className="p-4 border border-gray-200 rounded-md mt-2">
                    <dl className="space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">이름:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{formData.name}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">연락처:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{formData.phone}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">이메일:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{formData.email}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">제목:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{formData.title}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-gray-500">내용:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{formData.content}</dd>
                      </div>
                      {files.length > 0 && (
                        <div className="grid grid-cols-3 gap-1">
                          <dt className="text-sm font-medium text-gray-500">첨부파일:</dt>
                          <dd className="text-sm text-gray-900 col-span-2">
                            {files.map((file, index) => (
                              <div key={index}>{file.name}</div>
                            ))}
                          </dd>
                        </div>
                      )}
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
        ) : isLoading ? (
          <Button disabled className="bg-primary">
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
              처리 중...
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
