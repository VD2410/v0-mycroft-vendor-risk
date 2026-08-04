"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Newspaper, ExternalLink, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Article {
  title?: string
  source?: string
  sentiment?: string
  article_published_date?: string
  url?: string
  summary?: string
}

interface SentimentTabProps {
  articles: Article[]
  score?: number
  reasoning?: string
}

export function SentimentTab({ articles, score, reasoning }: SentimentTabProps) {
  const displayScore = score ?? 0

  const getRiskColor = (s: number) => {
    if (s >= 80) return "text-emerald-600"
    if (s >= 60) return "text-cyan-600"
    if (s >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getSentimentBadge = (sentiment?: string) => {
    const s = (sentiment || '').toLowerCase()
    if (s === 'positive') return { className: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: TrendingUp }
    if (s === 'negative') return { className: "bg-red-100 text-red-700 border-red-200", icon: TrendingDown }
    return { className: "bg-gray-100 text-gray-700 border-gray-200", icon: Minus }
  }

  const positiveCount = articles.filter(a => (a.sentiment || '').toLowerCase() === 'positive').length
  const negativeCount = articles.filter(a => (a.sentiment || '').toLowerCase() === 'negative').length
  const neutralCount = articles.filter(a => !['positive', 'negative'].includes((a.sentiment || '').toLowerCase())).length

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Reputation & Sentiment Score</h3>
              <p className="text-sm text-muted-foreground">Based on news analysis and public perception</p>
            </div>
            <div className={`text-4xl font-bold ${getRiskColor(displayScore)}`}>{displayScore}<span className="text-lg text-muted-foreground">/100</span></div>
          </div>
          <Progress value={displayScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Sentiment Distribution */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-emerald-600">{positiveCount}</div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <Minus className="w-5 h-5 text-gray-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-600">{neutralCount}</div>
            <div className="text-xs text-muted-foreground">Neutral</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-red-600">{negativeCount}</div>
            <div className="text-xs text-muted-foreground">Negative</div>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      {articles.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6 text-center">
            <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Articles Found</h3>
            <p className="text-sm text-muted-foreground">No news articles or media mentions were found for this company.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              News & Media ({articles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {articles.map((article, idx) => {
                const sentimentInfo = getSentimentBadge(article.sentiment)
                const SentimentIcon = sentimentInfo.icon
                return (
                  <div key={idx} className="p-3 rounded-lg border border-border/50 bg-secondary/30">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <SentimentIcon className="w-3 h-3" />
                          <Badge className={`text-xs ${sentimentInfo.className}`}>
                            {article.sentiment || 'neutral'}
                          </Badge>
                          {article.source && (
                            <span className="text-xs text-muted-foreground">{article.source}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground">{article.title || 'Untitled Article'}</p>
                        {article.summary && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.summary}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {article.article_published_date && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{article.article_published_date}</span>
                        )}
                        {article.url && (
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reasoning */}
      {reasoning && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Analysis & Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
