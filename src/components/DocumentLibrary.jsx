import React, { useState } from 'react'
import {
  DocumentTextIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { useDocuments } from '../hooks/useDocuments'
import LoadingSpinner from './LoadingSpinner'
import { formatDistanceToNow } from 'date-fns'

const DocumentLibrary = () => {
  const { documents, loading, deleteDocument } = useDocuments()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [selectedDocument, setSelectedDocument] = useState(null)

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄'
    if (fileType?.includes('word')) return '📝'
    if (fileType?.includes('text')) return '📃'
    if (fileType?.includes('image')) return '🖼️'
    return '📋'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredDocuments = documents
    .filter(doc => 
      doc.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.original_filename.localeCompare(b.original_filename)
        case 'size':
          return b.file_size - a.file_size
        case 'created_at':
        default:
          return new Date(b.created_at) - new Date(a.created_at)
      }
    })

  const handleDelete = async (document) => {
    if (window.confirm(`Are you sure you want to delete "${document.original_filename}"?`)) {
      await deleteDocument(document.id)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-field"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field w-auto"
        >
          <option value="created_at">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="size">Sort by Size</option>
        </select>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Upload your first document to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* File Icon and Name */}
              <div className="flex items-start space-x-3 mb-3">
                <div className="text-2xl">{getFileIcon(document.file_type)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {document.original_filename}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(document.file_size)}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                </div>
              </div>

              {/* Content Preview */}
              {document.content && (
                <div className="mb-4">
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {document.content.substring(0, 100)}...
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedDocument(document)}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => handleDelete(document)}
                  className="flex items-center text-sm text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  )
}

// Document Preview Modal Component
const DocumentPreviewModal = ({ document, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {document.original_filename}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {document.content ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {document.content}
              </pre>
            ) : (
              <p className="text-gray-500">No text content available for preview.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentLibrary
