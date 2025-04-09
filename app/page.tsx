"use client"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnalyzerForm from "@/components/analyzer-form"
import HistoryList from "@/components/history"
import { Button } from "@/components/ui/button"
import { NewspaperIcon, LogOutIcon } from "lucide-react"
import { motion } from "motion/react"
import Cookies from "js-cookie"
import { useTheme } from "next-themes"

import { MoonIcon, SunIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  async function handleLogout() {
    await Cookies.remove("token")
    await Cookies.remove("userId")
    router.push("/auth/login")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background"
    >
      <header className="border-b w-full py-4 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <NewspaperIcon className="h-8 w-8 text-primary" />
            <div className="flex flex-col justify-center items-start">
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                NewsArchieve
              </h1>
              <p className="text-sm text-muted-foreground">
                Analyze news articles for truthfulness
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleLogout}
              variant="destructive"
              className="gap-2"
            >
              <LogOutIcon className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="analyze" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
              <TabsTrigger value="analyze" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Analyze
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-4">
              <div className="w-full mx-auto">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                    Submit an article for analysis
                  </h2>
                  <div className="bg-card rounded-lg border p-6">
                    <AnalyzerForm />
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="w-full">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    Previously Analyzed Articles
                  </h2>
                  <div className="bg-card rounded-lg border p-6">
                    <HistoryList />
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </motion.div>
  )
}