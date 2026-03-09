'use client'

import { useState } from 'react'
import SearchForm from '@/components/search-form'
import NewsResults from '@/components/news-results'
import { Spinner } from '@/components/ui/spinner'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a news headline or story')
      return
    }

    setSearchQuery(query)
    setIsLoading(true)
    setError('')
    setArticles([])

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch articles')
      }

      setArticles(data.articles || [])
      if (data.articles?.length === 0) {
        setError('No articles found. Try a different search term.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 lg:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            News Verifier
          </h1>
          <p className="text-lg text-muted-foreground">
            Find and verify similar news stories across trusted sources
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 py-16">
            <Spinner className="h-8 w-8" />
            <p className="text-muted-foreground">Searching for related articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && articles.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Found {articles.length} article{articles.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-sm text-muted-foreground">
                Related to: <span className="font-medium text-foreground">{searchQuery}</span>
              </p>
            </div>
            <NewsResults articles={articles} />
          </>
        )}

        {/* Empty State */}
        {!isLoading && articles.length === 0 && !error && (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              Enter a news headline or story above to start searching
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
