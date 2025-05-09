"use client"

import { useState } from "react"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// FAQ 데이터
const faqs = [
  {
    category: "민원 신청",
    items: [
      {
        id: "faq-1",
        question: "민원은 어떻게 신청하나요?",
        answer: "홈페이지 상단 메뉴의 '민원신청' 버튼을 클릭하여 민원 신청 페이지로 이동한 후, 필요한 정보를 입력하여 신청할 수 있습니다. 민원 신청 시 AI가 자동으로 내용을 분석하여 적절한 부서로 배정됩니다."
      },
      {
        id: "faq-2",
        question: "민원 신청 시 필요한 정보는 무엇인가요?",
        answer: "민원 신청 시 이름, 연락처, 이메일 등의 개인정보와 민원 제목, 내용을 입력해야 합니다. 필요에 따라 관련 파일을 첨부할 수도 있습니다."
      },
      {
        id: "faq-3",
        question: "민원 신청 후 처리 과정은 어떻게 되나요?",
        answer: "민원이 접수되면 AI가 내용을 분석하여 적절한 부서로 배정합니다. 담당 부서에서 검토 후 처리 결과를 안내해 드립니다. 처리 상황은 '민원조회' 메뉴에서 확인할 수 있습니다."
      }
    ]
  },
  {
    category: "민원 조회",
    items: [
      {
        id: "faq-4",
        question: "나의 민원 처리 상황은 어떻게 확인하나요?",
        answer: "홈페이지 상단 메뉴의 '민원조회' 버튼을 클릭하여 민원 조회 페이지로 이동한 후, 민원 목록에서 확인할 수 있습니다. 각 민원의 상태(접수됨, 처리중, 처리완료, 반려)를 통해 처리 상황을 확인할 수 있습니다."
      },
      {
        id: "faq-5",
        question: "민원 처리 결과는 어떻게 알 수 있나요?",
        answer: "민원 처리가 완료되면 등록하신 이메일로 알림이 발송됩니다. 또한 '민원조회' 메뉴에서 해당 민원을 클릭하면 처리 결과 및 담당자의 답변을 확인할 수 있습니다."
      }
    ]
  },
  {
    category: "계정 관리",
    items: [
      {
        id: "faq-6",
        question: "비밀번호를 잊어버렸습니다. 어떻게 재설정하나요?",
        answer: "로그인 페이지에서 '비밀번호 찾기' 링크를 클릭하고, 가입 시 등록한 이메일 주소를 입력하면 비밀번호 재설정 링크가 발송됩니다. 이메일을 통해 새로운 비밀번호를 설정할 수 있습니다."
      },
      {
        id: "faq-7",
        question: "개인정보는 어떻게 수정하나요?",
        answer: "로그인 후 우측 상단의 사용자 아이콘을 클릭하고 '내 정보'를 선택하면 개인정보 수정 페이지로 이동합니다. 연락처, 이메일, 주소 등의 정보를 수정할 수 있습니다."
      }
    ]
  },
  {
    category: "기타",
    items: [
      {
        id: "faq-8",
        question: "민원 처리 기간은 얼마나 걸리나요?",
        answer: "민원의 종류와 복잡성에 따라 처리 기간이 다릅니다. 일반적으로 3~5일 내에 처리되며, 복잡한 민원의 경우 더 오래 걸릴 수 있습니다. AI 분석 결과에서 예상 처리 시간을 확인할 수 있습니다."
      },
      {
        id: "faq-9",
        question: "민원 신청 취소는 가능한가요?",
        answer: "민원이 접수된 후에는 취소가 불가능합니다. 신청 내용에 변경이 필요한 경우, 담당자에게 추가 정보를 제공하거나 새로운 민원을 신청해 주세요."
      },
      {
        id: "faq-10",
        question: "민원 처리 결과에 불만족할 경우 어떻게 하나요?",
        answer: "민원 처리 결과에 불만족할 경우, 해당 민원 상세 페이지에서 추가 문의를 작성하거나 새로운 민원을 신청할 수 있습니다. 또한 민원 만족도 조사에 의견을 남겨주시면 서비스 개선에 반영됩니다."
      }
    ]
  }
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // 검색어로 FAQ 필터링
  const filteredFaqs = searchQuery.trim() === "" 
    ? faqs
    : faqs.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "자주 묻는 질문", href: "/faq" },
            ]}
          />
          <div className="mt-6">
            <h1 className="kgds-heading-1 mb-6">자주 묻는 질문</h1>
            
            {/* 검색 바 */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="질문 검색하기"
                  className="pl-10 pr-4 py-3 border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            {/* FAQ 목록 */}
            <div className="space-y-8">
              {filteredFaqs.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">검색 결과가 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredFaqs.map(category => (
                  category.items.length > 0 && (
                    <div key={category.category} className="space-y-3">
                      <h2 className="kgds-heading-2">{category.category}</h2>
                      <Card>
                        <CardContent className="p-0">
                          <Accordion type="single" collapsible className="w-full">
                            {category.items.map(item => (
                              <AccordionItem key={item.id} value={item.id}>
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                  <span className="text-left font-medium">{item.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4">
                                  <p className="text-gray-700">{item.answer}</p>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    </div>
                  )
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
