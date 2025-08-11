import { useState, useEffect } from 'react'
import { documentsAPI } from '../services/api'
import toast from 'react-hot-toast'

export const useDocuments = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchDocuments = async (params = {}) => {
    try {
      const response = await documentsAPI.getDocuments(params)
      setDocuments(response.data)
    } catch (error) {
      toast.error('Failed to fetch documents')
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadDocument = async (file, onProgress) => {
    setUploading(true)
    try {
      const response = await documentsAPI.upload(file, onProgress)
      toast.success('Document uploaded successfully!')
      await fetchDocuments() // Refresh list
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || 'Upload failed'
      toast.error(message)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const deleteDocument = async (id) => {
    try {
      await documentsAPI.deleteDocument(id)
      toast.success('Document deleted successfully!')
      await fetchDocuments() // Refresh list
    } catch (error) {
      toast.error('Failed to delete document')
      console.error('Error deleting document:', error)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  return {
    documents,
    loading,
    uploading,
    fetchDocuments,
    uploadDocument,
    deleteDocument
  }
}
