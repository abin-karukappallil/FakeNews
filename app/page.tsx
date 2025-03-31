"use client"
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyzerForm from "@/components/analyzer-form";
import ResultsDisplay from "@/components/results-display";
import HistoryList from "@/components/history";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie"
export default function Home() {
  const router = useRouter();

  async function handleLogout() {
    await Cookies.remove("token");
    await Cookies.remove("userId");
    router.push("/auth/login"); 
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background">
      <header className="border-b w-full">
        <div className="container flex justify-between items-center py-4">
          <div className="flex flex-col justify-center items-center ml-10">
            <h1 className="text-2xl font-bold">Fake News Detector</h1>
            <p className="text-muted-foreground">Analyze news articles for truthfulness</p>
          </div>
          <Button size="sm" onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </header>

      <main className="container flex flex-col justify-center items-center py-6">
        <Tabs defaultValue="analyze" className="w-[50vw]">
          <TabsList className="grid bg-slate-600/45 w-full grid-cols-2 mb-8">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Submit an article for analysis</h2>
              <AnalyzerForm />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div>
              <h2 className="text-xl font-semibold mb-4">Previously Analyzed Articles</h2>
              <HistoryList />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
