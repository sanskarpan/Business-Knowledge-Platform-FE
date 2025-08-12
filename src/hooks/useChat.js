import { useState, useEffect } from 'react'
import { chatAPI } from '../services/api'
import toast from 'react-hot-toast'

export const useChat = () => {
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const fetchSessions = async () => {
    try {
      const response = await chatAPI.getSessions()
      setSessions(response.data)
    } catch (error) {
      toast.error('Failed to fetch chat sessions')
      console.error('Error fetching sessions:', error)
    }
  }

  const createSession = async (title) => {
    try {
      const response = await chatAPI.createSession(title)
      const newSession = response.data
      setSessions(prev => [newSession, ...prev])
      setCurrentSession(newSession)
      setMessages([])
      return newSession
    } catch (error) {
      toast.error('Failed to create chat session')
      console.error('Error creating session:', error)
    }
  }

  const selectSession = async (session) => {
    setCurrentSession(session)
    setLoading(true)
    try {
      const response = await chatAPI.getMessages(session.id)
      setMessages(response.data)
    } catch (error) {
      toast.error('Failed to load chat history')
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content) => {
    if (!currentSession) return

    setSending(true)
    
    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])

    try {
      // Prepare a placeholder assistant message for streaming updates
      const aiTempId = Date.now() + 1
      setMessages(prev => [
        ...prev,
        {
          id: aiTempId,
          role: 'assistant',
          content: '',
          sources: [],
          timestamp: new Date().toISOString(),
        },
      ])

      // Try streaming endpoint first
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const resp = await fetch(`${apiBase}/api/chat/sessions/${currentSession.id}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ content })
      })

      if (resp.ok && resp.headers.get('content-type')?.includes('text/plain')) {
        const reader = resp.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''
        let sources = []

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          const parts = buffer.split('\n\n')
          buffer = parts.pop() || ''

          for (const part of parts) {
            if (!part.startsWith('data:')) continue
            const payload = part.slice(5).trim()
            if (!payload) continue
            try {
              const evt = JSON.parse(payload)
              if (evt.type === 'token') {
                const token = evt.content || ''
                setMessages(prev => prev.map(m => m.id === aiTempId ? { ...m, content: (m.content || '') + token } : m))
              } else if (evt.type === 'end') {
                sources = evt.sources || []
              }
            } catch {}
          }
        }

        // Finalize sources on the placeholder message
        setMessages(prev => prev.map(m => m.id === aiTempId ? { ...m, sources } : m))
      } else {
        // Fallback to non-streaming endpoint
        const response = await chatAPI.sendMessage(currentSession.id, content)
        const rawSources = response.data.sources
        const sources = Array.isArray(rawSources)
          ? rawSources
          : (typeof rawSources === 'string' ? (() => { try { return JSON.parse(rawSources) } catch { return [] } })() : [])
        // Set the placeholder content to full response
        setMessages(prev => prev.map(m => m.id === aiTempId ? { ...m, content: response.data.message, sources } : m))
      }
    } catch (error) {
      toast.error('Failed to send message')
      console.error('Error sending message:', error)
      
      // Remove placeholder assistant message on error
      setMessages(prev => prev.filter(msg => !(msg.role === 'assistant' && msg.content === '')))
    } finally {
      setSending(false)
    }
  }

  const deleteSession = async (sessionId) => {
    try {
      await chatAPI.deleteSession(sessionId)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
        setMessages([])
      }
      toast.success('Chat session deleted')
    } catch (error) {
      toast.error('Failed to delete session')
      console.error('Error deleting session:', error)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  return {
    sessions,
    currentSession,
    messages,
    loading,
    sending,
    createSession,
    selectSession,
    sendMessage,
    deleteSession,
    fetchSessions
  }
}
