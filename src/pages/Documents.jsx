import React, { useState } from 'react'
import DocumentUploader from '../components/DocumentUploader'
import DocumentLibrary from '../components/DocumentLibrary'
import { useDocuments } from '../hooks/useDocuments'

const Documents = () => {
  const [activeTab, setActiveTab] = useState('upload')
  const { documents, loading, fetchDocuments } = useDocuments()

  const handleUploadComplete = () => {
    fetchDocuments()
    setActiveTab('library')
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upload Documents
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'library'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Document Library ({documents.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === 'upload' ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Documents</h3>
            <DocumentUploader onUploadComplete={handleUploadComplete} />
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Documents</h3>
            <DocumentLibrary />
          </div>
        )}
      </div>
    </div>
  )
}

export default Documents