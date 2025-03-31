"use client"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnalyzerForm from "@/components/analyzer-form"
import HistoryList from "@/components/history"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"

export default function Home() {
  const router = useRouter()

  async function handleLogout() {
    await Cookies.remove("token")
    await Cookies.remove("userId")
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b w-full py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-xl sm:text-2xl font-bold">Fake News Detector</h1>
            <p className="text-sm text-muted-foreground">Analyze news articles for truthfulness</p>
          </div>
          <Button size="sm" onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1">
        <Tabs defaultValue="analyze" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid bg-slate-600/45 w-full grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-4">
            <div className="w-full mx-auto">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Submit an article for analysis</h2>
              <AnalyzerForm />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Previously Analyzed Articles</h2>
              <HistoryList />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

