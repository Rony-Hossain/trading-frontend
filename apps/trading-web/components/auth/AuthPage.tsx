'use client'

import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'
import { TrendingUp, BarChart3, Shield, Target } from 'lucide-react'

type AuthMode = 'login' | 'signup'

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login')
  }

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: 'Real-time Market Data',
      description: 'Get live stock prices, charts, and market insights powered by professional-grade APIs.'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: 'Advanced Analytics',
      description: 'Technical indicators, pattern recognition, and AI-powered market analysis tools.'
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: 'Risk Management',
      description: 'Portfolio tracking, risk assessment, and intelligent trading signals.'
    },
    {
      icon: <Target className="h-8 w-8 text-red-600" />,
      title: 'Smart Alerts',
      description: 'Custom price alerts, technical signals, and real-time notifications.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Branding and Features */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <TrendingUp className="h-10 w-10 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900">Trading Platform</h1>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Professional trading tools and real-time market analysis at your fingertips
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Market Performance</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-blue-200">S&P 500</div>
                  <div className="font-bold">4,785.45</div>
                  <div className="text-green-300">+1.24%</div>
                </div>
                <div>
                  <div className="text-blue-200">NASDAQ</div>
                  <div className="font-bold">15,421.98</div>
                  <div className="text-green-300">+0.89%</div>
                </div>
                <div>
                  <div className="text-blue-200">DOW</div>
                  <div className="font-bold">37,863.80</div>
                  <div className="text-green-300">+0.56%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Authentication Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {mode === 'login' ? (
                <LoginForm onToggleMode={toggleMode} />
              ) : (
                <SignUpForm onToggleMode={toggleMode} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Platform</h4>
              <div className="space-y-1 text-sm">
                <p>Real-time Data</p>
                <p>Advanced Charts</p>
                <p>Portfolio Management</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
              <div className="space-y-1 text-sm">
                <p>Technical Analysis</p>
                <p>AI Forecasting</p>
                <p>Risk Assessment</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
              <div className="space-y-1 text-sm">
                <p>Documentation</p>
                <p>API Reference</p>
                <p>Community</p>
              </div>
            </div>
          </div>
          <p className="text-sm">© 2024 Trading Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}