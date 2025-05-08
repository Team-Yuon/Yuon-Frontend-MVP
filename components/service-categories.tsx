import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Home, Briefcase, GraduationCap, Car, Heart, Leaf, Users } from "lucide-react"

const categories = [
  {
    id: "general",
    name: "일반 민원",
    icon: <FileText className="h-6 w-6" />,
    href: "/complaints/general",
  },
  {
    id: "housing",
    name: "주택/건축",
    icon: <Home className="h-6 w-6" />,
    href: "/complaints/housing",
  },
  {
    id: "business",
    name: "기업/창업",
    icon: <Briefcase className="h-6 w-6" />,
    href: "/complaints/business",
  },
  {
    id: "education",
    name: "교육",
    icon: <GraduationCap className="h-6 w-6" />,
    href: "/complaints/education",
  },
  {
    id: "traffic",
    name: "교통/도로",
    icon: <Car className="h-6 w-6" />,
    href: "/complaints/traffic",
  },
  {
    id: "health",
    name: "보건/복지",
    icon: <Heart className="h-6 w-6" />,
    href: "/complaints/health",
  },
  {
    id: "environment",
    name: "환경",
    icon: <Leaf className="h-6 w-6" />,
    href: "/complaints/environment",
  },
  {
    id: "community",
    name: "지역사회",
    icon: <Users className="h-6 w-6" />,
    href: "/complaints/community",
  },
]

export function ServiceCategories() {
  return (
    <section className="kgds-section">
      <h2 className="kgds-heading-1 mb-6">민원 서비스</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={category.href}>
            <Card className="kgds-card h-full">
              <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-center">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
