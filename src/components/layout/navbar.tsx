import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"

const navItems = [
  { label: "U.S.", hasDropdown: true },
  { label: "World", hasDropdown: true },
  { label: "Business", hasDropdown: true },
  { label: "Arts", hasDropdown: true },
  { label: "Lifestyle", hasDropdown: true },
  { label: "Opinion", hasDropdown: true },
  { label: "Video", hasDropdown: true },
  { label: "Audio", hasDropdown: true },
  { label: "Games", hasDropdown: true },
  { label: "Cooking", hasDropdown: true },
  { label: "Wirecutter", hasDropdown: true },
  { label: "The Athletic", hasDropdown: true },
]

const languageOptions = [
  { label: "U.S.", active: true },
  { label: "INTERNATIONAL", active: false },
  { label: "CANADA", active: false },
  { label: "ESPAÑOL", active: false },
  { label: "中文", active: false },
]

export function SiteHeader() {
  const today = new Date()
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="w-full border-b border-border">
      {/* Top Bar */}
      <div className="max-w-[1285px] mx-auto pt-5 px-4">
        <div className="flex items-center justify-between py-2">
          {/* Left: Search & Language */}
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-muted rounded" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
            <nav className="hidden md:flex items-center gap-3">
              {languageOptions.map((lang) => (
                <Link
                  key={lang.label}
                  href="#"
                  className={`text-xs tracking-wide ${
                    lang.active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">The Polytimes</h1>
          </Link>

          {/* Right: Subscribe & Login */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Dow</span>
              <span className="text-green-600 font-medium">+0.48% ↑</span>
            </div>
            <button className="hidden sm:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-bold px-4">
              SUBSCRIBE FOR $1/WEEK
            </button>
            <button className="text-xs font-bold px-4 border-foreground bg-transparent">
              LOG IN
            </button>
          </div>
        </div>

        {/* Date & Today's Paper */}
        <div className="flex items-center gap-4 py-2 text-sm">
          <span className="text-foreground">{dateString}</span>
          <Link href="#" className="text-foreground hover:underline">
            Today's Paper
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-t border-border">
        <div className="max-w-[1285px] mx-auto px-4">
          <ul className="flex items-center justify-center gap-1 py-2 overflow-x-auto">
            {navItems.map((item) => (
              <li key={item.label}>
                <button className="flex items-center gap-1 px-3 py-1 text-sm hover:bg-muted rounded whitespace-nowrap">
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
