'use client'

import ComingSoon, { ComingSoonLink, ComingSoonBadge } from '@/components/ui/coming-soon'
import { Home, Settings, BarChart, MessageSquare } from 'lucide-react'

export default function TestComingSoonPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Test: Coming Soon Components</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coming Soon Links */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Coming Soon Links</h2>
            <ul className="space-y-3">
              <li>
                <ComingSoonLink
                  message="API documentation coming soon"
                  feature="REST endpoints and SDKs"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  API Documentation
                </ComingSoonLink>
              </li>
              <li>
                <ComingSoonLink
                  message="Blog section in development"
                  feature="Tips and tutorials about WhatsApp automation"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Blog
                </ComingSoonLink>
              </li>
              <li>
                <ComingSoonLink
                  message="Industry-specific pages being built"
                  feature="Custom solutions for salons, restaurants, clinics"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Industry Solutions
                </ComingSoonLink>
              </li>
            </ul>
          </div>

          {/* Coming Soon Buttons */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Coming Soon Buttons</h2>
            <div className="space-y-3">
              <ComingSoon
                message="Advanced analytics dashboard in development"
                feature="Real-time metrics, conversion tracking, ROI analysis"
              >
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <BarChart className="w-4 h-4" />
                  View Analytics
                </button>
              </ComingSoon>

              <ComingSoon
                message="WhatsApp Business API configuration coming soon"
                feature="Message templates, automation flows, smart responses"
              >
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Configure WhatsApp
                </button>
              </ComingSoon>

              <ComingSoon
                message="Advanced settings panel in development"
                feature="Customization, integrations, team management"
              >
                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </ComingSoon>
            </div>
          </div>

          {/* Coming Soon Badges */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Coming Soon Badges</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Mobile App</span>
                <ComingSoonBadge text="Coming Soon" />
              </div>
              <div className="flex items-center justify-between">
                <span>API Access</span>
                <ComingSoonBadge text="In Development" />
              </div>
              <div className="flex items-center justify-between">
                <span>Team Collaboration</span>
                <ComingSoonBadge text="Q2 2024" />
              </div>
              <div className="flex items-center justify-between">
                <span>Advanced Reporting</span>
                <ComingSoonBadge />
              </div>
            </div>
          </div>

          {/* Navigation Example */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Navigation Example</h2>
            <nav className="space-y-2">
              <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Home className="w-4 h-4 inline mr-2" />
                Dashboard
              </a>

              <ComingSoon
                message="Analytics section under construction"
                feature="Detailed performance metrics and insights"
              >
                <div className="block px-4 py-2 text-gray-700 rounded-lg">
                  <BarChart className="w-4 h-4 inline mr-2" />
                  Analytics
                </div>
              </ComingSoon>

              <ComingSoon
                message="Settings page coming soon"
                feature="Account management and preferences"
              >
                <div className="block px-4 py-2 text-gray-700 rounded-lg">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Settings
                </div>
              </ComingSoon>
            </nav>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}