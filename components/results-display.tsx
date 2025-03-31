"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisResult {
  id: string
  title: string
  content: string
  rating: number
  date: string
  type: "url" | "text"
}

export default function ResultsDisplay() {
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
  const storedResult = localStorage.getItem("currentResult")
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    }
  }, [])

  if (!result) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-muted-foreground">No article has been analyzed yet. Submit an article to see results.</p>
        </CardContent>
      </Card>
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500"
    if (rating >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const getRatingBackground = (rating: number) => {
    if (rating >= 8) return "bg-green-500"
    if (rating >= 6) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getRatingIcon = (rating: number) => {
    if (rating >= 8) return <CheckCircle className="h-6 w-6 text-green-500" />
    if (rating >= 6) return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    return <XCircle className="h-6 w-6 text-red-500" />
  }

  const getRatingText = (rating: number) => {
    if (rating >= 8) return "Likely True"
    if (rating >= 6) return "Uncertain"
    return "Likely False"
  }

  const getDetailedAnalysis = (rating: number) => {
    if (rating >= 8) {
      return "This article appears to contain factual information from reliable sources. The content is likely accurate and trustworthy."
    }
    if (rating >= 6) {
      return "This article contains some accurate information but may include unverified claims or misleading content. Further verification is recommended."
    }
    return "This article contains significant misinformation or false claims. The content is likely unreliable and should not be trusted without extensive verification."
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getRatingIcon(result.rating)}
          <span>Trueness Rating: {getRatingText(result.rating)}</span>
        </CardTitle>
        <CardDescription>Analyzed on {new Date(result.date).toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>False</span>
            <span>Uncertain</span>
            <span>True</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full", getRatingBackground(result.rating))}
              style={{ width: `${result.rating * 10}%` }}
            />
          </div>
          <div className="flex justify-center mt-2">
            <div className={cn("text-2xl font-bold", getRatingColor(result.rating))}>{result.rating}/10</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="h-4 w-4" />
            Analysis Summary
          </h3>
          <p>{getDetailedAnalysis(result.rating)}</p>
        </div>

        <div className="space-y-2 border-t pt-4">
          <h3 className="font-semibold">Analyzed Content</h3>
          <div className="rounded-md border p-3 text-sm">
            {result.type === "url" ? (
              <a
                href={result.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all"
              >
                {result.content}
              </a>
            ) : (
              <p className="whitespace-pre-wrap break-words">{result.content}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

