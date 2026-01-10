import { SectionHeader } from "./sectionHeader"
import Image from "next/image"

const sectionLinks = [
  { label: "Congress Challenges Trump", href: "#" },
  { label: "Why Trump Wants Greenland", href: "#" },
  { label: "Epstein Files", href: "#" },
  { label: "Tariff Tracker", href: "#" },
  { label: "Approval Rating", href: "#" },
]

const leftArticles = [
  {
    title: "Judge Blocks Trump Officials From Freezing Billions in Social Services Funds",
    description:
      "The judge directed the Trump administration to release funds for three social services programs it had planned to withhold from five Democratic-led states.",
    readTime: "",
    hasMoreUpdates: true,
  },
  {
    title: "Trump Calls for 10 Percent Credit Card Interest Cap, After Killing Other Fee Limits",
    readTime: "2 MIN READ",
  },
  {
    title: "Trump Threatens to Take Greenland 'the Hard Way'",
    readTime: "3 MIN READ",
  },
]

const bottomArticles = [
  {
    title: "Trump Administration Freezes Food Stamps in Minnesota",
    readTime: "2 MIN READ",
  },
  {
    title: "Judge Bars Trump From Withholding Election Funds to States",
    readTime: "2 MIN READ",
  },
]

export function TrumpAdministrationSection() {
  return (
    <section className="max-w-[1285px] mx-auto px-4 py-6 border-t border-border">
      <SectionHeader title="Trump Administration" links={sectionLinks} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Headlines */}
        <div className="lg:col-span-3 space-y-0 divide-y divide-border">
          {leftArticles.map((article, index) => (
            <div key={index} className="py-4 first:pt-0">
              <h3 className="font-headline font-bold text-lg md:text-xl leading-tight">
                <a href="#" className="hover:underline">
                  {article.title}
                </a>
              </h3>
              {article.description && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{article.description}</p>
              )}
              {article.hasMoreUpdates && (
                <a href="#" className="text-sm text-foreground hover:underline mt-2 inline-flex items-center gap-1">
                  See more updates <span>›</span>
                </a>
              )}
              {article.readTime && (
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">
                  {article.readTime}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Center Column - Featured Image */}
        <div className="lg:col-span-5">
          <div className="relative">
            <img
              src="/orchestra-opera-performance-stage.jpg"
              alt="Washington National Opera performance"
              width={600}
              height={400}
              className="w-full h-auto"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">Kenny Holston for The Polytimes</p>
          </div>
          <h3 className="font-headline font-bold text-xl md:text-2xl leading-tight mt-4">
            <a href="#" className="hover:underline">
              Washington National Opera Is Leaving the Kennedy Center
            </a>
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">
            The opera, which has performed at the arts center since 1971, was concerned about declines in attendance and
            donations during President Trump's second term.
          </p>
          <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">6 MIN READ</span>

          {/* Bottom articles in this column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
            {bottomArticles.map((article, index) => (
              <div key={index}>
                <h4 className="font-headline font-bold text-base leading-tight">
                  <a href="#" className="hover:underline">
                    {article.title}
                  </a>
                </h4>
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">
                  {article.readTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Opinion */}
        <div className="lg:col-span-4">
          <OpinionSection />
        </div>
      </div>
    </section>
  )
}

function OpinionSection() {
  const opinionArticles = [
    {
      author: "JAMES KIRCHICK",
      title: "Greenland Is Only the Beginning. Trump Has His Sights Set on Europe.",
      readTime: "6 MIN READ",
      hasImage: true,
      imageUrl: "/abstract-art-illustration-trump-europe.jpg",
    },
    {
      author: "LYDIA POLGREEN",
      title: "Trump's One Small Trick to Destroy American Democracy",
      readTime: "8 MIN READ",
      hasAvatar: true,
    },
    {
      author: "SAKET SONI",
      title: "America Needs to Weatherproof Its Homes. Badly.",
      readTime: "4 MIN READ",
      hasImage: true,
      imageUrl: "/house-weather-damage.jpg",
    },
    {
      author: "DAVID BROOKS",
      title: "The Sins of the Moderates",
      readTime: "6 MIN READ",
      hasAvatar: true,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base">Opinion</h3>
        <div className="flex gap-1">
          <button className="w-8 h-8 border border-border rounded-full flex items-center justify-center hover:bg-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-8 h-8 border border-border rounded-full flex items-center justify-center hover:bg-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {opinionArticles.map((article, index) => (
          <div key={index} className="flex gap-3 py-3 border-b border-border last:border-0">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{article.author}</span>
              <h4 className="font-headline font-bold text-base md:text-lg leading-tight mt-1">
                <a href="#" className="hover:underline">
                  {article.title}
                </a>
              </h4>
              <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">
                {article.readTime}
              </span>
            </div>
            {article.hasImage && article.imageUrl && (
              <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28">
                <img
                  src={article.imageUrl || "/placeholder.svg"}
                  alt=""
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {article.hasAvatar && (
              <div className="flex-shrink-0">
                <img
                  src="/headshot-portrait-author.jpg"
                  alt={article.author}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom opinion items */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">JACOB FREY</span>
          <h4 className="font-headline font-bold text-sm leading-tight mt-1">
            <a href="#" className="hover:underline">
              I'm the Mayor of Minneapolis. Trump Is Lying to You.
            </a>
          </h4>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">THE OPINIONS</span>
          <h4 className="font-headline font-bold text-sm leading-tight mt-1">
            <a href="#" className="hover:underline">
              From Kardashian Injectable Lips to Mar-a-Lago Face
            </a>
          </h4>
        </div>
      </div>
    </div>
  )
}
