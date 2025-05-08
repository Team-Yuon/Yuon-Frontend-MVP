"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, User, Bell } from "lucide-react"

export function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="kgds-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center mr-2">
                <span className="text-white font-bold">유성</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 hidden sm:block">유성구청</span>
                <span className="text-xs text-gray-500 hidden sm:block">민원24</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/complaints" className="text-gray-700 hover:text-primary font-medium">
              민원신청
            </Link>
            <Link href="/status" className="text-gray-700 hover:text-primary font-medium">
              민원조회
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-primary font-medium">
              자주 묻는 질문
            </Link>
            <Link href="/guide" className="text-gray-700 hover:text-primary font-medium">
              이용안내
            </Link>
          </nav>

          {/* Search and User */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="검색어를 입력하세요"
                className="pl-10 pr-4 py-2 w-64 border-gray-200 focus:border-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700">
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="kgds-container">
            <div className="flex items-center mb-4">
              <Input
                type="search"
                placeholder="검색어를 입력하세요"
                className="pl-10 pr-4 py-2 w-full border-gray-200"
              />
              <Search className="absolute left-7 top-[5.5rem] transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <nav className="flex flex-col space-y-3">
              <Link href="/complaints" className="text-gray-700 hover:text-primary font-medium py-2">
                민원신청
              </Link>
              <Link href="/status" className="text-gray-700 hover:text-primary font-medium py-2">
                민원조회
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-primary font-medium py-2">
                자주 묻는 질문
              </Link>
              <Link href="/guide" className="text-gray-700 hover:text-primary font-medium py-2">
                이용안내
              </Link>
              <div className="flex space-x-4 pt-2">
                <Button variant="outline" size="sm" className="flex-1 border-gray-200">
                  <Bell className="h-4 w-4 mr-2" />
                  알림
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-gray-200">
                  <User className="h-4 w-4 mr-2" />
                  로그인
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
