"use client"

import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "이용안내", href: "/guide" },
            ]}
          />
          <div className="mt-6">
            <h1 className="kgds-heading-1 mb-6">이용안내</h1>
            
            <Tabs defaultValue="usage">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="usage">이용방법</TabsTrigger>
                <TabsTrigger value="process">처리절차</TabsTrigger>
                <TabsTrigger value="ai">AI 검증 안내</TabsTrigger>
                <TabsTrigger value="terms">이용약관</TabsTrigger>
              </TabsList>
              
              {/* 이용방법 탭 */}
              <TabsContent value="usage">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">민원 서비스 이용방법</h2>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">1</span>
                          회원가입 및 로그인
                        </h3>
                        <p className="ml-8 text-gray-700">
                          유성구청 민원 서비스를 이용하기 위해서는 회원가입 후 로그인이 필요합니다. 
                          이메일, 이름, 연락처 등의 정보를 입력하여 회원가입을 진행해주세요.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">2</span>
                          민원 신청
                        </h3>
                        <p className="ml-8 text-gray-700">
                          로그인 후 상단 메뉴의 '민원신청' 버튼을 클릭하여 민원 작성 페이지로 이동합니다.
                          민원인 정보, 민원 내용, 첨부파일 등을 입력하고 제출합니다.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">3</span>
                          AI 검증
                        </h3>
                        <p className="ml-8 text-gray-700">
                          민원 내용을 입력하면 AI가 자동으로 내용을 분석하여 적절한 카테고리와 담당 부서를 추천합니다.
                          AI 검증 결과를 확인하고 최종 민원을 제출합니다.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">4</span>
                          민원 조회
                        </h3>
                        <p className="ml-8 text-gray-700">
                          상단 메뉴의 '민원조회' 버튼을 클릭하여 본인이 신청한 민원 목록을 확인할 수 있습니다.
                          각 민원의 처리 상태(접수됨, 처리중, 처리완료, 반려)를 확인할 수 있습니다.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">5</span>
                          결과 확인
                        </h3>
                        <p className="ml-8 text-gray-700">
                          민원 처리가 완료되면 등록된 이메일로 알림이 발송됩니다.
                          민원 상세 페이지에서 처리 결과 및 담당자의A 답변을 확인할 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* 처리절차 탭 */}
              <TabsContent value="process">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">민원 처리 절차</h2>
                    
                    <div className="relative">
                      {/* 프로세스 라인 */}
                      <div className="absolute left-4 top-10 bottom-10 w-0.5 bg-gray-200 z-0"></div>
                      
                      <div className="space-y-8 relative z-10">
                        <div className="flex">
                          <div className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">1</div>
                          <div className="bg-gray-50 p-4 rounded-lg flex-grow">
                            <h3 className="font-medium text-lg">민원 접수</h3>
                            <p className="text-gray-700 mt-1">
                              사용자가 작성한 민원이 시스템에 접수됩니다. 접수된 민원은 고유한 접수번호가 부여됩니다.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">2</div>
                          <div className="bg-gray-50 p-4 rounded-lg flex-grow">
                            <h3 className="font-medium text-lg">AI 검증</h3>
                            <p className="text-gray-700 mt-1">
                              AI가 민원 내용을 분석하여 카테고리를 분류하고 적절한 부서를 추천합니다.
                              민원의 우선순위와 예상 처리 시간도 함께 분석됩니다.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">3</div>
                          <div className="bg-gray-50 p-4 rounded-lg flex-grow">
                            <h3 className="font-medium text-lg">담당자 배정</h3>
                            <p className="text-gray-700 mt-1">
                              AI가 추천한 부서의 담당자에게 민원이 배정됩니다.
                              담당자는 민원 내용을 검토하고 처리를 시작합니다.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">4</div>
                          <div className="bg-gray-50 p-4 rounded-lg flex-grow">
                            <h3 className="font-medium text-lg">처리 및 답변</h3>
                            <p className="text-gray-700 mt-1">
                              담당자가 민원을 처리하고 처리 결과를 시스템에 등록합니다.
                              필요한 경우 추가 자료를 요청하거나 유선 연락을 통해 상세 내용을 확인할 수 있습니다.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">5</div>
                          <div className="bg-gray-50 p-4 rounded-lg flex-grow">
                            <h3 className="font-medium text-lg">만족도 조사</h3>
                            <p className="text-gray-700 mt-1">
                              민원 처리가 완료되면 민원인에게 만족도 조사를 실시합니다.
                              피드백은 서비스 개선에 활용됩니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* AI 검증 안내 탭 */}
              <TabsContent value="ai">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">AI 민원 검증 시스템 안내</h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-700">
                        유성구청 민원 시스템은 최신 AI 기술을 활용하여 민원을 효율적으로 처리합니다.
                        AI 검증 시스템은 다음과 같은 기능을 제공합니다:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-2">민원 내용 분석</h3>
                          <p className="text-gray-700">
                            AI가 민원 내용을 자동으로 분석하여 핵심 키워드를 추출하고
                            민원의 성격과 주요 내용을 파악합니다.
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-2">카테고리 분류</h3>
                          <p className="text-gray-700">
                            분석된 내용을 바탕으로 민원을 적절한 카테고리로 분류합니다.
                            이를 통해 담당 부서로 빠르게 전달할 수 있습니다.
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-2">담당 부서 추천</h3>
                          <p className="text-gray-700">
                            민원 내용과 카테고리를 바탕으로 가장 적합한 담당 부서를 추천합니다.
                            이를 통해 민원이 빠르게 적절한 부서에 배정됩니다.
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-2">유사 민원 검색</h3>
                          <p className="text-gray-700">
                            기존에 접수된 민원 중 유사한 내용의 민원을 검색하여 참고자료로 제공합니다.
                            이를 통해 처리 시간을 단축하고 일관된 답변을 제공할 수 있습니다.
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-2">처리 시간 예측</h3>
                          <p className="text-gray-700">
                            민원의 복잡성과 유사 민원의 처리 시간을 분석하여
                            예상 처리 시간을 제공합니다.
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-2">우선순위 분석</h3>
                          <p className="text-gray-700">
                            민원의 내용과 시급성을 분석하여 우선순위를 정합니다.
                            이를 통해 중요하고 긴급한 민원을 우선적으로 처리할 수 있습니다.
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg mt-6">
                        <h3 className="font-medium text-lg mb-2 text-blue-700">AI 검증의 한계</h3>
                        <p className="text-blue-700">
                          AI 검증 시스템은 효율적인 민원 처리를 돕기 위한 도구이지만,
                          모든 민원을 완벽하게 분석할 수는 없습니다.
                          최종적인 민원 처리 및 판단은 담당 공무원에 의해 이루어집니다.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* 이용약관 탭 */}
              <TabsContent value="terms">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">이용약관</h2>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-96 overflow-y-auto">
                      <h3 className="font-medium text-lg mb-2">제1조 (목적)</h3>
                      <p className="text-gray-700 mb-4">
                        이 약관은 유성구청(이하 "구청"이라 합니다)이 제공하는 민원 처리 서비스(이하 "서비스"라 합니다)의 이용조건 및 절차, 
                        이용자와 구청의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
                      </p>
                      
                      <h3 className="font-medium text-lg mb-2">제2조 (용어의 정의)</h3>
                      <p className="text-gray-700 mb-4">
                        이 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br /><br />
                        1. "서비스"라 함은 구청이 제공하는
                        모든 서비스를 의미합니다.<br />
                        2. "이용자"라 함은 구청에 접속하여 이 약관에 따라 구청이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.<br />
                        3. "회원"이라 함은 구청에 개인정보를 제공하여 회원등록을 한 자로서, 구청의 정보를 지속적으로 제공받으며, 구청이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.<br />
                        4. "비회원"이라 함은 회원에 가입하지 않고 구청이 제공하는 서비스를 이용하는 자를 말합니다.<br />
                      </p>
                      
                      <h3 className="font-medium text-lg mb-2">제3조 (약관의 효력 및 변경)</h3>
                      <p className="text-gray-700 mb-4">
                        1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.<br />
                        2. 구청은 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지함으로써 효력이 발생합니다.<br />
                        3. 이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다. 
                        변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우 약관의 변경사항에 동의한 것으로 간주됩니다.<br />
                      </p>
                      
                      <h3 className="font-medium text-lg mb-2">제4조 (서비스의 제공 및 변경)</h3>
                      <p className="text-gray-700 mb-4">
                        1. 구청은 다음과 같은 서비스를 제공합니다.<br />
                        &nbsp;&nbsp;① 민원 접수 및 처리 서비스<br />
                        &nbsp;&nbsp;② AI 기반 민원 분석 및 분류 서비스<br />
                        &nbsp;&nbsp;③ 민원 처리 결과 조회 서비스<br />
                        &nbsp;&nbsp;④ 기타 구청이 정하는 서비스<br /><br />
                        2. 구청은 기술적 사양의 변경 등의 이유로 서비스의 내용을 변경할 수 있습니다. 
                        이 경우 변경된 서비스의 내용 및 제공일자를 명시하여 공지합니다.<br />
                      </p>
                      
                      <h3 className="font-medium text-lg mb-2">제5조 (개인정보보호)</h3>
                      <p className="text-gray-700 mb-4">
                        1. 구청은 관련법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다.<br />
                        2. 개인정보의 보호 및 사용에 대해서는 관련법령 및 구청의 개인정보처리방침이 적용됩니다.<br />
                        3. 구청은 이용자의 개인정보를 본인의 승낙 없이 제3자에게 제공하지 않습니다. 
                        다만, 다음의 경우에는 예외로 합니다.<br />
                        &nbsp;&nbsp;① 법령에 의해 제공이 요구되는 경우<br />
                        &nbsp;&nbsp;② 서비스의 제공에 관한 계약의 이행을 위하여 필요한 개인정보로서 경제적/기술적인 사유로 통상의 동의를 받는 것이 현저히 곤란한 경우<br />
                        &nbsp;&nbsp;③ 개인을 식별하기에 특정할 수 없는 상태로 가공하여 이용하는 경우<br />
                      </p>
                      
                      <h3 className="font-medium text-lg mb-2">제6조 (민원 처리)</h3>
                      <p className="text-gray-700 mb-4">
                        1. 구청은 이용자가 제출한 민원에 대해 신속하고 정확하게 처리하기 위해 노력합니다.<br />
                        2. 민원 처리 과정에서 추가 정보가 필요한 경우, 구청은 이용자에게 추가 정보를 요청할 수 있습니다.<br />
                        3. 민원 처리 결과는 이용자가 제공한 연락처(이메일, 전화번호 등)를 통해 통지됩니다.<br />
                        4. 다음과 같은 경우 민원 처리가 거부될 수 있습니다.<br />
                        &nbsp;&nbsp;① 민원 내용이 불명확하거나 허위인 경우<br />
                        &nbsp;&nbsp;② 동일한 내용의 민원을 반복적으로 제출하는 경우<br />
                        &nbsp;&nbsp;③ 타인을 비방하거나 명예를 훼손하는 내용을 포함하는 경우<br />
                        &nbsp;&nbsp;④ 법령에 위반되는 내용을 포함하는 경우<br />
                      </p>
                      
                      <h3 className="font-medium text-lg mb-2">제7조 (AI 분석 서비스)</h3>
                      <p className="text-gray-700 mb-4">
                        1. 구청은 AI 기술을 활용하여 민원 내용을 분석하고 적절한 부서로 배정하는 서비스를 제공합니다.<br />
                        2. AI 분석 결과는 참고사항일 뿐, 최종적인 민원 처리 판단은 담당 공무원에 의해 이루어집니다.<br />
                        3. 구청은 AI 분석 서비스의 정확성을 높이기 위해 지속적으로 노력하지만, 분석 결과의 완전성을 보장하지는 않습니다.<br />
                      </p>
                      
                      <h3 className="font-medium text-lg mb-2">제8조 (이용자의 의무)</h3>
                      <p className="text-gray-700 mb-4">
                        1. 이용자는 다음 행위를 하여서는 안 됩니다.<br />
                        &nbsp;&nbsp;① 회원가입 신청 또는 변경 시 허위 내용을 등록하는 행위<br />
                        &nbsp;&nbsp;② 타인의 정보를 도용하는 행위<br />
                        &nbsp;&nbsp;③ 구청이 게시한 정보를 변경하는 행위<br />
                        &nbsp;&nbsp;④ 구청이 정한 정보 이외의 정보(컴퓨터 프로그램 등)를 송신 또는 게시하는 행위<br />
                        &nbsp;&nbsp;⑤ 구청과 기타 제3자의 저작권 등 지적재산권을 침해하는 행위<br />
                        &nbsp;&nbsp;⑥ 구청 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위<br />
                        &nbsp;&nbsp;⑦ 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위<br />
                        &nbsp;&nbsp;⑧ 기타 불법적이거나 부당한 행위<br />
                        2. 이용자는 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 구청이 통지하는 사항 등을 준수하여야 하며, 기타 구청의 업무에 방해되는 행위를 하여서는 안 됩니다.<br />
                      </p>
                      
                      <h3 className="font-medium text-lg mb-2">제9조 (저작권의 귀속 및 이용제한)</h3>
                      <p className="text-gray-700">
                        1. 구청이 작성한 저작물에 대한 저작권 기타 지적재산권은 구청에 귀속합니다.<br />
                        2. 이용자는 서비스를 이용함으로써 얻은 정보를 구청의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.<br />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
