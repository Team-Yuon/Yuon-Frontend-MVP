"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface AiVerificationStepProps {
  onComplete: (result: {
    status: "success" | "info" | "warning"
    message: string
    suggestion?: string
  }) => void
}

export function AiVerificationStep({ onComplete }: AiVerificationStepProps) {
  const [step, setStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const steps = [
      { delay: 1000, nextStep: 2 },
      { delay: 1500, nextStep: 3 },
      { delay: 2000, nextStep: 4 },
      { delay: 1000, nextStep: 5 },
    ]

    if (step <= 4) {
      const timer = setTimeout(
        () => {
          setStep(steps[step - 1].nextStep)
          if (step === 4) {
            setIsComplete(true)
            onComplete({
              status: "info",
              message: "민원 내용이 AI에 의해 분석되었습니다.",
              suggestion:
                "해당 민원은 '환경 > 소음공해' 카테고리로 분류되었으며, 관련 부서는 '환경관리과'입니다. 처리 예상 시간은 3-5일입니다.",
            })
          }
        },
        steps[step - 1].delay,
      )

      return () => clearTimeout(timer)
    }
  }, [step, onComplete])

  const steps = [
    { id: 1, label: "민원 내용 분석 중" },
    { id: 2, label: "유사 민원 검색 중" },
    { id: 3, label: "담당 부서 확인 중" },
    { id: 4, label: "처리 방법 확인 중" },
  ]

  return (
    <Card className="kgds-card">
      <CardContent className="p-6">
        <h3 className="kgds-heading-3 mb-4">AI 민원 검증</h3>
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center">
              {step > s.id ? (
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              ) : step === s.id ? (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-xs text-gray-500">{s.id}</span>
                </div>
              )}
              <span
                className={`text-sm ${
                  step === s.id ? "text-blue-600 font-medium" : step > s.id ? "text-green-600" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
