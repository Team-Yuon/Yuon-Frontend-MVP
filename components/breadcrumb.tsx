import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />}
            {index === items.length - 1 ? (
              <span className="text-sm font-medium text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="text-sm font-medium text-primary hover:text-primary/80">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
