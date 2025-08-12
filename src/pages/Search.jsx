import React, { useState } from 'react'
import { MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useSearch } from '../hooks/useSearch'
import LoadingSpinner from '../components/LoadingSpinner'

const Search = () => {
  const { results, loading, query, search, clearResults } = useSearch()
  const [searchInput, setSearchInput] = useState('')
  const [searchType, setSearchType] = useState('hybrid')
  const [fileType, setFileType] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      search(searchInput.trim(), { searchType, fileType: fileType || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined })
    }
  }

  const handleClear = () => {
    setSearchInput('')
    clearResults()
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search your documents
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter your search query..."
                className="pl-10 input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Type
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="input-field"
              >
                <option value="hybrid">Hybrid (Text + Semantic)</option>
                <option value="text">Text Search</option>
                <option value="semantic">Semantic Search</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
              <select className="input-field" value={fileType} onChange={(e) => setFileType(e.target.value)}>
                <option value="">All</option>
                <option value="pdf">PDF</option>
                <option value="word">Word</option>
                <option value="text">Text/Markdown</option>
                <option value="image">Image</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input type="date" className="input-field" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input type="date" className="input-field" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="flex items-end space-x-2 col-span-full sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                disabled={!searchInput.trim() || loading}
                className="btn-primary"
              >
                {loading ? <LoadingSpinner size="small" /> : 'Search'}
              </button>
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn-secondary"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {query && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results for "{query}"
            </h3>
            <span className="text-sm text-gray-500">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms or search type.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <SearchResultCard key={`${result.document_id}-${index}`} result={result} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Search Result Card Component
const SearchResultCard = ({ result }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-3">
        <DocumentTextIcon className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-medium text-gray-900 truncate">
            {result.filename}
          </h4>
          <div className="mt-2">
            <p className="text-sm text-gray-600 line-clamp-3">
              {result.content_snippet}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">
                Relevance: {Math.round(result.relevance_score * 100)}%
              </span>
            </div>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View Document
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
