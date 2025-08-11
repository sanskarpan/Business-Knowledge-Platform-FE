import React, { useState } from 'react'
import {
  PlusIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'

const ChatSidebar = ({
  sessions,
  currentSession,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  isOpen,
  onToggle
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const handleDelete = (sessionId, e) => {
    e.stopPropagation()
    setShowDeleteConfirm(sessionId)
  }

  const confirmDelete = (sessionId) => {
    onDeleteSession(sessionId)
    setShowDeleteConfirm(null)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 lg:hidden z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed lg:relative lg:translate-x-0 z-50
        w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full
        transition-transform duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => onCreateSession()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onToggle}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No conversations yet</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className={`
                    relative group p-3 rounded-lg cursor-pointer transition-colors duration-200
                    ${currentSession?.id === session.id 
                      ? 'bg-primary-50 border border-primary-200' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {session.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity duration-200"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === session.id && (
                    <div className="absolute inset-0 bg-white border border-red-200 rounded-lg p-2 z-10">
                      <p className="text-xs text-gray-700 mb-2">Delete this conversation?</p>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            confirmDelete(session.id)
                          }}
                          className="flex-1 text-xs bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowDeleteConfirm(null)
                          }}
                          className="flex-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>
    </>
  )
}

export default ChatSidebar