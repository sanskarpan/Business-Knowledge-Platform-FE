import React from 'react'
import { useLocation } from 'react-router-dom'
import { BellIcon,MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const getPageTitle = (pathname) => {
  const routes = {
    '/': 'Dashboard',
    '/documents': 'Documents',
    '/chat': 'Chat',
    '/search': 'Search',
    '/analytics': 'Analytics'
  }
  return routes[pathname] || 'Knowledge Platform'
}

const Header = () => {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <BellIcon className="h-6 w-6" />
          </button>
          
          {/* Quick search */}
          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Quick search..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
