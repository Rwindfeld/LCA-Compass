import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { MobileNav } from "@/components/dashboard/MobileNav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bone overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 pb-20 lg:p-8 lg:pb-8"
        >
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
