import Link from "next/link"

export function MainFooter() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="kgds-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">이용안내</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guide" className="text-sm text-gray-600 hover:text-primary">
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link href="/guide/process" className="text-sm text-gray-600 hover:text-primary">
                  민원처리 절차
                </Link>
              </li>
              <li>
                <Link href="/guide/faq" className="text-sm text-gray-600 hover:text-primary">
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">민원서비스</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/complaints/new" className="text-sm text-gray-600 hover:text-primary">
                  민원신청
                </Link>
              </li>
              <li>
                <Link href="/complaints/status" className="text-sm text-gray-600 hover:text-primary">
                  민원조회
                </Link>
              </li>
              <li>
                <Link href="/complaints/types" className="text-sm text-gray-600 hover:text-primary">
                  민원유형 안내
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">관련사이트</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.gov.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  정부24
                </a>
              </li>
              <li>
                <a
                  href="https://www.yuseong.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  유성구청
                </a>
              </li>
              <li>
                <a
                  href="https://www.epeople.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  국민신문고
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">연락처</h3>
            <p className="text-sm text-gray-600 mb-2">대표전화: 042-611-2000</p>
            <p className="text-sm text-gray-600 mb-2">주소: 대전광역시 유성구 대학로 211</p>
            <p className="text-sm text-gray-600">운영시간: 평일 09:00 - 18:00 (공휴일 제외)</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/korean-government-logo.png" alt="정부 로고" className="h-10 w-10 mr-3" />
              <div>
                <p className="text-sm text-gray-900 font-medium">유성구청</p>
                <p className="text-xs text-gray-500">대전광역시 유성구</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} 유성구청 민원24. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
