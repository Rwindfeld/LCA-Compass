import { MarketingHeader } from "@/components/landing/MarketingHeader"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bone">
      <MarketingHeader />
      <main id="main-content">{children}</main>
    </div>
  )
}
