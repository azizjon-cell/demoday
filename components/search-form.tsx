'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Search } from 'lucide-react'

interface SearchFormProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(input)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="news-input" className="block text-sm font-medium text-foreground">
          Paste a news headline or story
        </label>
        <Textarea
          id="news-input"
          placeholder="Enter the news headline or article text you want to verify..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          rows={5}
          className="resize-none"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !input.trim()}
        size="lg"
        className="w-full gap-2"
      >
        <Search className="h-5 w-5" />
        {isLoading ? 'Searching...' : 'Check News'}
      </Button>
    </form>
  )
}
