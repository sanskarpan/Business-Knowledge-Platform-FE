import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import Chat from './pages/Chat'
import Search from './pages/Search'
import Analytics from './pages/Analytics'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
return (
    <Router>
    <AuthProvider>
        <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
            }>
            <Route index element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="chat" element={<Chat />} />
            <Route path="search" element={<Search />} />
            <Route path="analytics" element={<Analytics />} />
            </Route>
        </Routes>
        </div>
    </AuthProvider>
    </Router>
)}

export default App