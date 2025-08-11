import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { analyticsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await analyticsAPI.getDashboardData()
        setDashboardData(response.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  const stats = [
    {
      name: 'Total Storage',
      value: dashboardData?.summary.total_storage_mb ? `${dashboardData.summary.total_storage_mb} MB` : '0 MB',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      link: '/documents'
    },
    {
      name: 'Searches This Week',
      value: dashboardData?.summary.searches_week || 0,
      icon: MagnifyingGlassIcon,
      color: 'bg-green-500',
      link: '/search'
    },
    {
      name: 'Chat Sessions',
      value: dashboardData?.summary.chat_sessions_week || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-purple-500',
      link: '/chat'
    },
    {
      name: 'Activities Today',
      value: dashboardData?.summary.activities_today || 0,
      icon: ChartBarIcon,
      color: 'bg-orange-500',
      link: '/analytics'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">
          Here's an overview of your knowledge platform activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Upload */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/documents"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <DocumentTextIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Upload Documents</p>
                <p className="text-sm text-gray-500">Add new files to your knowledge base</p>
              </div>
            </Link>
            <Link
              to="/chat"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Start Chat</p>
                <p className="text-sm text-gray-500">Ask questions about your documents</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {dashboardData?.daily_activity && dashboardData.daily_activity.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.daily_activity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">{activity.date}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {activity.activities} activities
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard