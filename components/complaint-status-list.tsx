"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getComplaints } from "@/lib/api"
import { formatDate, translateStatus } from "@/lib/apiUtils"

interface ComplaintStatusListProps {
  status?: string;
}

export function ComplaintStatusList({ status }: ComplaintStatusListProps) {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      setIsLoading(true);
      try {
        const params: any = { page: 1, limit: 10 };
        
        if (status) {
          params.status = status.toUpperCase();
        }
        
        const response = await getComplaints(params);
        setComplaints(response.data || []);
      } catch (error) {
        console.error("민원 목록 로딩 실패:", error);
        toast({
          title: "민원 목록 로딩 실패",
          description: "민원 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaints();
  }, [status, toast]);

  if (isLoading) {
    return (
      <Card className="kgds-card mt-4">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">민원 정보를 불러오는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  if (complaints.length === 0) {
    return (
      <Card className="kgds-card mt-4">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">조회된 민원이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {complaints.map((complaint) => (
        <Card key={complaint.id} className="kgds-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
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
                  <span className="text-sm text-gray-500">{complaint.referenceNumber}</span>
                </div>
                <h3 className="kgds-heading-3">{complaint.title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                  <span>{complaint.category ? `${complaint.category.name}` : "미분류"}</span>
                  <span className="hidden sm:inline">|</span>
                  <span>접수일: {formatDate(complaint.createdAt)}</span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm" className="flex items-center border-[#DFE4E8]">
                  <Link href={`/status/${complaint.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    상세보기
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
