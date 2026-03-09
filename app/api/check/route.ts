import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEWSAPI_KEY

    if (!apiKey) {
      console.error('NEWSAPI_KEY is not set')
      return NextResponse.json(
        { error: 'News API is not configured' },
        { status: 500 }
      )
    }

    // Use NewsAPI.org to search for articles
    const searchQuery = encodeURIComponent(query)
    const url = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=relevancy&language=en&pageSize=10&apiKey=${apiKey}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'NewsVerifier/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`NewsAPI responded with status ${response.status}`)
    }

    const data = await response.json()

    // Handle rate limit or error responses from NewsAPI
    if (data.status !== 'ok') {
      console.error('NewsAPI error:', data.message)
      if (data.code === 'rateLimited') {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: data.message || 'Failed to fetch articles' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching articles' },
      { status: 500 }
    )
  }
}
