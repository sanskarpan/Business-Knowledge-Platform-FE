
import React, { useState, useEffect, useRef } from 'react'
import { useChat } from '../hooks/useChat'
import ChatSidebar from '../components/ChatSidebar'
import ChatInterface from '../components/ChatInterface'
import LoadingSpinner from '../components/LoadingSpinner'

const Chat = () => {
  const {
    sessions,
    currentSession,
    messages,
    loading,
    sending,
    createSession,
    selectSession,
    sendMessage,
    deleteSession
  } = useChat()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Auto-create first session if none exist
    if (sessions.length === 0 && !loading) {
      createSession('New Conversation')
    }
  }, [sessions, loading, createSession])

  return (
    <div className="flex h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentSession={currentSession}
        onSelectSession={selectSession}
        onCreateSession={createSession}
        onDeleteSession={deleteSession}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <ChatInterface
            session={currentSession}
            messages={messages}
            onSendMessage={sendMessage}
            loading={loading}
            sending={sending}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to Chat
              </h3>
              <p className="text-gray-500 mb-4">
                Select a conversation or create a new one to get started.
              </p>
              <button
                onClick={() => createSession()}
                className="btn-primary"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
