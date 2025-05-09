"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, User, KeyRound, Save, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // 인증 체크
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // 사용자 정보 설정
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: "",  // 백엔드에서 가져오는 정보로 업데이트 필요
        address: ""  // 백엔드에서 가져오는 정보로 업데이트 필요
      })
    }
  }, [user])

  // 프로필 정보 업데이트 처리
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // 여기서 프로필 업데이트 API 호출 구현 필요
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "프로필 업데이트 성공",
        description: "사용자 정보가 성공적으로 업데이트되었습니다.",
      })
    }, 1000)
  }

  // 비밀번호 변경 처리
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 비밀번호 유효성 검사
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }
    
    setIsChangingPassword(true)
    
    // 여기서 비밀번호 변경 API 호출 구현 필요
    setTimeout(() => {
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      toast({
        title: "비밀번호 변경 성공",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      })
    }, 1000)
  }

  if (isLoading) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-grow">
        <div className="kgds-container py-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "내 정보", href: "/profile" },
            ]}
          />
          <div className="mt-6">
            <h1 className="kgds-heading-1 mb-6">내 정보</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 사용자 정보 요약 */}
              <div>
                <Card className="kgds-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                        <User className="h-12 w-12 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold mb-1">{user?.name || "사용자"}</h2>
                      <p className="text-gray-500 mb-4">{user?.email || ""}</p>
                      
                      <div className="w-full mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">역할</span>
                          <Badge>
                            {user?.role === "ADMIN" 
                              ? "관리자" 
                              : user?.role === "DEPARTMENT_MANAGER" 
                                ? "부서 관리자" 
                                : "일반 사용자"}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-500 mt-4">
                          <p>마지막 로그인: 2023-05-08</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* 사용자 정보 관리 탭 */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="profile">프로필 정보</TabsTrigger>
                    <TabsTrigger value="password">비밀번호 변경</TabsTrigger>
                  </TabsList>
                  
                  {/* 프로필 정보 탭 */}
                  <TabsContent value="profile">
                    <Card className="kgds-card">
                      <CardHeader>
                        <CardTitle>프로필 정보</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleProfileUpdate}>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">이름</Label>
                                <Input
                                  id="name"
                                  value={profileData.name}
                                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">이메일</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={profileData.email}
                                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="phone">연락처</Label>
                                <Input
                                  id="phone"
                                  value={profileData.phone}
                                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="address">주소</Label>
                                <Input
                                  id="address"
                                  value={profileData.address}
                                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end mt-6">
                              <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                  <>
                                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                                    저장 중...
                                  </>
                                ) : (
                                  <>
                                    <Save className="mr-2 h-4 w-4" />
                                    변경사항 저장
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* 비밀번호 변경 탭 */}
                  <TabsContent value="password">
                    <Card className="kgds-card">
                      <CardHeader>
                        <CardTitle>비밀번호 변경</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handlePasswordChange}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">현재 비밀번호</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">새 비밀번호</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                required
                              />
                            </div>
                            
                            <Alert className="bg-blue-50 border-blue-200 mt-4">
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                              <AlertTitle className="text-blue-600">비밀번호 변경 안내</AlertTitle>
                              <AlertDescription className="text-blue-600">
                                안전한 비밀번호를 위해 최소 8자 이상, 숫자와 특수문자를 포함해주세요.
                              </AlertDescription>
                            </Alert>
                            
                            <div className="flex justify-end mt-6">
                              <Button type="submit" disabled={isChangingPassword}>
                                {isChangingPassword ? (
                                  <>
                                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                                    변경 중...
                                  </>
                                ) : (
                                  <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    비밀번호 변경
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
