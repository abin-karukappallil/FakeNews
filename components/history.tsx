"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertTriangle, XCircle, Search, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
interface AnalysisResult {
  id: number
  link: string
  heading:string
  rating: number
  image?: string
}

export default function HistoryList() {
  const [history, setHistory] = useState<AnalysisResult[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history")
        if (!res.ok) {
          toast.error("Error fetching data", { richColors: true })
          return
        }
        const data = await res.json()
        if (data.status === 200 && Array.isArray(data.history)) {
          const formattedHistory = data.history.map((item: any) => ({
            id: item.id,
            link: item.link,
            heading: item.heading,
            image: item.image,
            rating: Number(item.rating),
          }))
          setHistory(formattedHistory)
        } else {
          toast.error("Received data is not in expected format", { richColors: true })
        }
      } catch (e) {
        console.error("Error fetching history:", e)
        toast.error("Error fetching data", { richColors: true })
      }
    }

    fetchHistory()
  }, [])

  const filteredHistory = Array.isArray(history)
    ? history.filter(
        (item) =>
          item.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.rating.toString().includes(searchTerm.toLowerCase()),
      )
    : []

  const getRatingIcon = (rating: number) => {
    if (rating >= 8) return <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
    if (rating >= 6) return <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
    return <XCircle className="h-5 w-5 text-red-500 shrink-0" />
  }

  const getRatingText = (rating: number) => {
    if (rating >= 8) return "Likely True"
    if (rating >= 6) return "Uncertain"
    return "Likely False"
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (rating >= 6) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-muted-foreground">
              {history.length === 0
                ? "No analysis history found. Analyze an article to see it here."
                : "No results match your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 w-full">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="overflow-hidden">
            
              <div className="flex flex-col sm:flex-row">
              <Image className="p-2 ml-8" src={item.image || "/placeholder.png"} unoptimized height={30} width={160} alt=""/>
                <div className="flex-1 p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    {getRatingIcon(item.rating)}
                    <div className="space-y-1 flex-1 min-w-0">
                    <h1 className="text-xl font-semibold">{item.heading}</h1>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        
                        <h3 className="font-medium text-xs md:text-sm line-clamp-1 break-all">{item.link}</h3>
                        <span
                          className={cn(
                            "text-xs px-2 sm:px-4 py-1 sm:py-2 rounded-full whitespace-nowrap mt-1 sm:mt-0",
                            getRatingColor(item.rating),
                          )}
                        >
                          {item.rating}/10 - {getRatingText(item.rating)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild className="text-xs sm:text-sm">
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Visit Source
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

