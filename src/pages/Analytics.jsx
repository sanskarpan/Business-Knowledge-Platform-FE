import React, { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { analyticsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Analytics = () => {
  const [usageData, setUsageData] = useState(null)
  const [documentData, setDocumentData] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [usage, documents, dashboard] = await Promise.all([
          analyticsAPI.getUsageAnalytics(timeRange),
          analyticsAPI.getDocumentAnalytics(),
          analyticsAPI.getDashboardData()
        ])
        
        setUsageData(usage.data)
        setDocumentData(documents.data)
        setDashboardData(dashboard.data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (loading) {
    return <LoadingSpinner />
  }

  // Prepare chart data
  const activityChartData = dashboardData?.daily_activity?.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    activities: day.activities
  })) || []

  const fileTypeData = documentData?.documents_by_type ? 
    Object.entries(documentData.documents_by_type).map(([type, count]) => ({
      name: type,
      value: count
    })) : []

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="input-field w-auto"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Documents"
          value={usageData?.total_documents || 0}
          icon={DocumentTextIcon}
          color="blue"
        />
        <MetricCard
          title="Total Searches"
          value={usageData?.total_searches || 0}
          icon={MagnifyingGlassIcon}
          color="green"
        />
        <MetricCard
          title="Chat Sessions"
          value={usageData?.total_chat_sessions || 0}
          icon={ChatBubbleLeftRightIcon}
          color="purple"
        />
        <MetricCard
          title="Activities"
          value={usageData?.recent_activities?.length || 0}
          icon={ChartBarIcon}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activities" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* File Types Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Types</h3>
          <div className="h-64">
            {fileTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fileTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fileTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        {usageData?.recent_activities?.length > 0 ? (
          <div className="space-y-3">
            {usageData.recent_activities.slice(0, 10).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent activities</p>
        )}
      </div>

      {/* Recent Documents */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Uploaded Documents</h3>
        {documentData?.recent_uploads?.length > 0 ? (
          <div className="space-y-3">
            {documentData.recent_uploads.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.filename}</p>
                    <p className="text-xs text-gray-500">
                      {doc.file_type} • {(doc.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(doc.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
        )}
      </div>
    </div>
  )
}

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  }

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'upload':
        return DocumentTextIcon
      case 'search':
        return MagnifyingGlassIcon
      case 'chat':
        return ChatBubbleLeftRightIcon
      default:
        return ChartBarIcon
    }
  }

  const getActionText = (action) => {
    switch (action) {
      case 'upload':
        return 'Uploaded document'
      case 'search':
        return 'Performed search'
      case 'chat':
        return 'Started chat'
      case 'create_session':
        return 'Created chat session'
      case 'delete':
        return 'Deleted document'
      default:
        return action
    }
  }

  const ActionIcon = getActionIcon(activity.action)

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <ActionIcon className="h-5 w-5 text-gray-500" />
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          {getActionText(activity.action)}
          {activity.details && (
            <span className="text-gray-500">
              {activity.details.filename && ` - ${activity.details.filename}`}
              {activity.details.query && ` - "${activity.details.query}"`}
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default Analytics