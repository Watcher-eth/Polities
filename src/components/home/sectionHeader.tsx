import Link from "next/link"

interface SectionHeaderProps {
  title: string
  links?: { label: string; href: string }[]
}

export function SectionHeader({ title, links = [] }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-border pb-3 mb-4">
      <h2 className="font-headline font-bold text-lg">{title}</h2>
      {links.length > 0 && (
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
