'use client'

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Calendar, Building2 } from 'lucide-react'

interface Article {
  title: string
  description: string
  url: string
  urlToImage: string | null
  source: {
    id: string
    name: string
  }
  publishedAt: string
  author?: string
}

interface NewsResultsProps {
  articles: Article[]
}

export default function NewsResults({ articles }: NewsResultsProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {articles.map((article, index) => (
        <Card
          key={index}
          className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            {article.urlToImage && (
              <div className="relative h-48 w-full md:h-40 md:w-40 lg:h-48 lg:w-48 flex-shrink-0">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Content Section */}
            <div className="flex flex-col justify-between p-4 md:flex-1 md:p-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-bold text-foreground line-clamp-2 text-lg">
                    {article.title}
                  </h3>
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground md:line-clamp-3">
                  {article.description || 'No description available'}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {article.source.name}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt)}
                  </Badge>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                  >
                    Read Full Article
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
