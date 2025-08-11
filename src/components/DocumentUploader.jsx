import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDocuments } from '../hooks/useDocuments'
import toast from 'react-hot-toast'

const DocumentUploader = ({ onUploadComplete }) => {
  const { uploadDocument } = useDocuments()
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadingFiles, setUploadingFiles] = useState([])

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(error => {
        if (error.code === 'file-too-large') {
          toast.error(`${file.name} is too large. Maximum size is 100MB.`)
        } else if (error.code === 'file-invalid-type') {
          toast.error(`${file.name} is not a supported file type.`)
        }
      })
    })

    // Process accepted files
    for (const file of acceptedFiles) {
      const fileId = `${file.name}-${Date.now()}`
      
      setUploadingFiles(prev => [...prev, { id: fileId, name: file.name, file }])
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

      try {
        const progressCallback = (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
        }

        await uploadDocument(file, progressCallback)
        
        // Remove from uploading list on success
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId))
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[fileId]
          return newProgress
        })

        if (onUploadComplete) {
          onUploadComplete()
        }
      } catch (error) {
        // Remove from uploading list on error
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId))
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[fileId]
          return newProgress
        })
      }
    }
  }, [uploadDocument, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  })

  const removeUploadingFile = (fileId) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileId]
      return newProgress
    })
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-lg font-medium text-gray-900">
          {isDragActive ? 'Drop files here' : 'Upload Documents'}
        </p>
        <p className="text-sm text-gray-500">
          Drag & drop files here, or click to select
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supports PDF, DOCX, TXT, MD, JPG, PNG (max 100MB)
        </p>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploading Files</h4>
          {uploadingFiles.map((file) => (
            <div key={file.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <DocumentIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <div className="mt-1">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[file.id] || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadProgress[file.id] || 0}% uploaded
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeUploadingFile(file.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DocumentUploader