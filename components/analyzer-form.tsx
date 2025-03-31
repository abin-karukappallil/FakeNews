"use client"

import type React from "react"

/* eslint-disable no-unused-vars */
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, LinkIcon } from "lucide-react"

export default function AnalyzerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [inputType, setInputType] = useState<"url" | "text">("url")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [truthScore, setTruthScore] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:8000/check", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(inputType === "url" ? { url } : { text }),
      })

      if (!res.ok) {
        toast.error("Analysis failed", {
          richColors: true,
        })
        return
      }

      const data = await res.json()
      console.log(data)
      const score = data.rating
      setTruthScore(score)
      console.log(score)
      setResult(getTruthRating(score))

      const addNewsRes = await fetch("/api/Add_news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          link: inputType === "url" ? url : null,
          rating: score,
        }),
      })

      if (!addNewsRes.ok) {
        toast.error("Failed to save the news data", { richColors: true })
        return
      }
      toast.success("Successfully analyzed and saved the content", { richColors: true })
    } catch (error) {
      console.error("Error analyzing content:", error)
      toast.error("An error occurred during analysis", {
        richColors: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTruthRating = (score: number) => {
    if (score >= 1 && score <= 3) {
      return "Likely Fake (No credible sources found)"
    } else if (score >= 4 && score <= 6) {
      return "Unverified (Few sources, but not high-profile)"
    } else if (score >= 7 && score <= 10) {
      return "Genuine (Reported by multiple trusted media sources)"
    }
    return "Unknown Rating"
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6 w-full">
        <Tabs defaultValue="url" className="w-full" onValueChange={(value) => setInputType(value as "url" | "text")}>
          <TabsList className="bg-gray-600/45 grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="article">Article</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">News Article URL</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="url"
                      placeholder="https://example.com/news-article"
                      className="pl-10"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="mt-2 sm:mt-0">
                    {isLoading ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="article" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">News Article Text</Label>
                <Textarea
                  id="text"
                  placeholder="Paste the full text of the news article here..."
                  className="min-h-[200px]"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>

        <div className="mt-6 flex items-start gap-2 rounded-lg border p-3 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="text-muted-foreground">
            <p>
              For the most accurate results, please provide the full article text or a direct link to the original
              source.
            </p>
          </div>
        </div>

        {result && truthScore !== null && (
          <div className="mt-6 p-4 bg-gray-200 rounded-md">
            <p className="font-semibold">Truthfulness Rating:</p>
            <p>{result}</p>
            <p className="mt-2 text-sm text-gray-500">Score: {truthScore}/10</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

