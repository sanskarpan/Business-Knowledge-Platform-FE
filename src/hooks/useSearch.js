
import { useState } from 'react'
import { searchAPI } from '../services/api'
import toast from 'react-hot-toast'

export const useSearch = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const search = async (searchQuery, options = {}) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setQuery(searchQuery)
    
    try {
      const response = await searchAPI.search(searchQuery, options)
      setResults(response.data)
    } catch (error) {
      toast.error('Search failed')
      console.error('Error searching:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const findSimilar = async (documentId, limit = 5) => {
    setLoading(true)
    try {
      const response = await searchAPI.findSimilar(documentId, limit)
      return response.data
    } catch (error) {
      toast.error('Failed to find similar documents')
      console.error('Error finding similar:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
    setQuery('')
  }

  return {
    results,
    loading,
    query,
    search,
    findSimilar,
    clearResults
  }
}