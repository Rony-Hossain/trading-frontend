'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { marketDataAPI } from '../lib/api'
import { formatCurrency, formatPercentage } from '../lib/utils'
import { Bell, BellRing, Plus, X, TrendingUp, TrendingDown, Target, AlertTriangle, Check, Settings } from 'lucide-react'

interface Alert {
  id: string
  symbol: string
  type: 'price_above' | 'price_below' | 'price_change' | 'volume_spike' | 'technical_signal'
  condition: string
  targetValue: number
  currentValue: number
  isActive: boolean
  isTriggered: boolean
  createdAt: Date
  triggeredAt?: Date
  message: string
}

interface AlertsNotificationsProps {
  watchlist: string[]
}

export function AlertsNotifications({ watchlist }: AlertsNotificationsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activeNotifications, setActiveNotifications] = useState<Alert[]>([])
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    type: 'price_above' as Alert['type'],
    targetValue: '',
    condition: ''
  })

  // Mock alerts for demonstration
  const mockAlerts: Alert[] = [
    {
      id: '1',
      symbol: 'AAPL',
      type: 'price_above',
      condition: 'Price above $180',
      targetValue: 180,
      currentValue: 175.50,
      isActive: true,
      isTriggered: false,
      createdAt: new Date('2024-01-15'),
      message: 'AAPL price alert set for $180'
    },
    {
      id: '2',
      symbol: 'TSLA',
      type: 'price_below',
      condition: 'Price below $200',
      targetValue: 200,
      currentValue: 245.30,
      isActive: true,
      isTriggered: false,
      createdAt: new Date('2024-01-14'),
      message: 'TSLA price alert set for $200'
    },
    {
      id: '3',
      symbol: 'GOOGL',
      type: 'price_change',
      condition: 'Daily change > 5%',
      targetValue: 5,
      currentValue: 2.3,
      isActive: true,
      isTriggered: false,
      createdAt: new Date('2024-01-13'),
      message: 'GOOGL daily change alert set for 5%'
    },
    {
      id: '4',
      symbol: 'MSFT',
      type: 'technical_signal',
      condition: 'RSI oversold (<30)',
      targetValue: 30,
      currentValue: 45,
      isActive: true,
      isTriggered: true,
      createdAt: new Date('2024-01-12'),
      triggeredAt: new Date('2024-01-16'),
      message: 'MSFT RSI oversold signal triggered'
    }
  ]

  useEffect(() => {
    setAlerts(mockAlerts)
    
    // Simulate checking alerts every 30 seconds
    const interval = setInterval(async () => {
      await checkAlerts()
    }, 30000)

    // Initial check
    checkAlerts()

    return () => clearInterval(interval)
  }, [watchlist])

  const checkAlerts = async () => {
    const triggeredAlerts: Alert[] = []

    for (const alert of alerts) {
      if (!alert.isActive || alert.isTriggered) continue

      try {
        // Simulate checking current price/conditions
        const shouldTrigger = Math.random() > 0.95 // 5% chance to trigger for demo

        if (shouldTrigger) {
          const triggeredAlert: Alert = {
            ...alert,
            isTriggered: true,
            triggeredAt: new Date(),
            message: `Alert triggered: ${alert.condition} for ${alert.symbol}`
          }
          
          triggeredAlerts.push(triggeredAlert)
          
          // Show browser notification if supported
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Trading Alert: ${alert.symbol}`, {
              body: alert.condition,
              icon: '/favicon.ico'
            })
          }
        }
      } catch (error) {
        console.error(`Error checking alert for ${alert.symbol}:`, error)
      }
    }

    if (triggeredAlerts.length > 0) {
      setActiveNotifications(prev => [...prev, ...triggeredAlerts])
      setAlerts(prev => prev.map(alert => 
        triggeredAlerts.find(t => t.id === alert.id) || alert
      ))
    }
  }

  const createAlert = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAlert.symbol && newAlert.targetValue) {
      const alert: Alert = {
        id: Date.now().toString(),
        symbol: newAlert.symbol.toUpperCase(),
        type: newAlert.type,
        condition: getConditionText(newAlert.type, newAlert.targetValue),
        targetValue: parseFloat(newAlert.targetValue),
        currentValue: 0,
        isActive: true,
        isTriggered: false,
        createdAt: new Date(),
        message: `Alert created for ${newAlert.symbol}`
      }

      setAlerts(prev => [...prev, alert])
      setNewAlert({ symbol: '', type: 'price_above', targetValue: '', condition: '' })
      setShowCreateAlert(false)
    }
  }

  const getConditionText = (type: Alert['type'], value: number): string => {
    switch (type) {
      case 'price_above': return `Price above $${value}`
      case 'price_below': return `Price below $${value}`
      case 'price_change': return `Daily change > ${value}%`
      case 'volume_spike': return `Volume spike > ${value}x average`
      case 'technical_signal': return `Technical signal: ${value}`
      default: return `Alert condition: ${value}`
    }
  }

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ))
  }

  const dismissNotification = (alertId: string) => {
    setActiveNotifications(prev => prev.filter(alert => alert.id !== alertId))
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const activeAlertsCount = alerts.filter(alert => alert.isActive && !alert.isTriggered).length
  const triggeredAlertsCount = alerts.filter(alert => alert.isTriggered).length

  return (
    <div className="space-y-6">
      {/* Notifications Popup */}
      {activeNotifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {activeNotifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className="bg-red-500 text-white p-4 rounded-lg shadow-lg border border-red-600 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-bold text-sm">{notification.symbol} Alert</div>
                  <div className="text-sm">{notification.condition}</div>
                  <div className="text-xs opacity-90 mt-1">
                    {notification.triggeredAt?.toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{activeAlertsCount}</div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <BellRing className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{triggeredAlertsCount}</div>
                <div className="text-sm text-gray-600">Triggered Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{watchlist.length}</div>
                <div className="text-sm text-gray-600">Monitored Symbols</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Alert Management</span>
            </CardTitle>
            <div className="flex space-x-2">
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
              >
                <Settings className="h-4 w-4 inline mr-1" />
                Enable Notifications
              </button>
              <button
                onClick={() => setShowCreateAlert(!showCreateAlert)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Create Alert
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateAlert && (
            <form onSubmit={createAlert} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newAlert.symbol}
                  onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Symbol</option>
                  {watchlist.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>

                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value as Alert['type']})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="price_above">Price Above</option>
                  <option value="price_below">Price Below</option>
                  <option value="price_change">Daily Change %</option>
                  <option value="volume_spike">Volume Spike</option>
                  <option value="technical_signal">Technical Signal</option>
                </select>

                <input
                  type="number"
                  step="0.01"
                  placeholder="Target Value"
                  value={newAlert.targetValue}
                  onChange={(e) => setNewAlert({...newAlert, targetValue: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  Create Alert
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateAlert(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Alerts List */}
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No alerts configured. Create your first alert to get started.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.isTriggered 
                      ? 'bg-red-50 border-red-200' 
                      : alert.isActive 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium text-lg">{alert.symbol}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.isTriggered 
                            ? 'bg-red-100 text-red-800' 
                            : alert.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.isTriggered ? 'Triggered' : alert.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{alert.condition}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created: {alert.createdAt.toLocaleDateString()}
                        {alert.triggeredAt && (
                          <span className="ml-3">
                            Triggered: {alert.triggeredAt.toLocaleDateString()} {alert.triggeredAt.toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {alert.isTriggered && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      {!alert.isTriggered && (
                        <button
                          onClick={() => toggleAlert(alert.id)}
                          className={`p-2 rounded-full ${
                            alert.isActive 
                              ? 'text-green-600 hover:bg-green-100' 
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={alert.isActive ? 'Disable Alert' : 'Enable Alert'}
                        >
                          <Bell className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        title="Delete Alert"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BellRing className="h-5 w-5" />
            <span>Recent Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts
              .filter(alert => alert.isTriggered)
              .sort((a, b) => (b.triggeredAt?.getTime() || 0) - (a.triggeredAt?.getTime() || 0))
              .slice(0, 10)
              .map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <BellRing className="h-4 w-4 text-red-600" />
                    <div>
                      <div className="font-medium text-sm">{alert.symbol} - {alert.condition}</div>
                      <div className="text-xs text-gray-500">
                        {alert.triggeredAt?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              ))}
            
            {alerts.filter(alert => alert.isTriggered).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No recent notifications
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AlertsNotifications