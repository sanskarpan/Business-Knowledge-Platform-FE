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
      const response = await chatAPI.sendMessage(currentSession.id, content)
      
      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.message,
        sources: response.data.sources,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      toast.error('Failed to send message')
      console.error('Error sending message:', error)
      
      // Remove user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id))
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
