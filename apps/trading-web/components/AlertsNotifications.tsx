'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { marketDataAPI } from '../lib/api'
import { formatCurrency, formatPercentage } from '../lib/utils'
import { Bell, BellRing, Plus, X, TrendingUp, TrendingDown, Target, AlertTriangle, Check, Settings } from 'lucide-react'

interface AlertRule {
  id: string
  symbol: string
  alert_type: 'price_threshold' | 'price_change' | 'volume_spike' | 'technical_signal'
  condition: 'above' | 'below' | 'crosses_above' | 'crosses_below'
  threshold: number
  enabled: boolean
  cooldown_minutes: number
  last_triggered: string | null
  created_at: string
}

interface AlertTrigger {
  rule_id: string
  symbol: string
  message: string
  current_value: number
  threshold: number
  triggered_at: string
}

interface AlertStats {
  total_rules: number
  active_rules: number
  total_triggers: number
  recent_triggers: number
  symbols_monitored: number
}

interface AlertsNotificationsProps {
  watchlist: string[]
}

export function AlertsNotifications({ watchlist }: AlertsNotificationsProps) {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [alertTriggers, setAlertTriggers] = useState<AlertTrigger[]>([])
  const [alertStats, setAlertStats] = useState<AlertStats | null>(null)
  const [activeNotifications, setActiveNotifications] = useState<AlertTrigger[]>([])
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    type: 'price_threshold' as AlertRule['alert_type'],
    condition: 'above' as AlertRule['condition'],
    threshold: ''
  })

  // Load alert data from backend
  const loadAlerts = async () => {
    try {
      setLoading(true)
      const [statsResponse, triggersResponse] = await Promise.all([
        marketDataAPI.getAlertStats(),
        marketDataAPI.getAlertTriggers(50)
      ])
      
      setAlertStats(statsResponse)
      setAlertTriggers(triggersResponse.triggers || [])
      
      // Load rules for each symbol in watchlist
      const allRules: AlertRule[] = []
      for (const symbol of watchlist) {
        try {
          const rulesResponse = await marketDataAPI.getAlertRules(symbol)
          if (rulesResponse.rules) {
            allRules.push(...rulesResponse.rules)
          }
        } catch (err) {
          console.error(`Error loading rules for ${symbol}:`, err)
        }
      }
      setAlertRules(allRules)
      
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
    
    // Check for new alert triggers every 30 seconds
    const interval = setInterval(() => {
      loadAlerts()
    }, 30000)

    return () => clearInterval(interval)
  }, [watchlist])

  // Check for new alert triggers and show notifications
  useEffect(() => {
    const newTriggers = alertTriggers.filter(trigger => 
      !activeNotifications.some(active => active.rule_id === trigger.rule_id && 
        active.triggered_at === trigger.triggered_at)
    )
    
    if (newTriggers.length > 0) {
      setActiveNotifications(prev => [...prev, ...newTriggers])
      
      // Show browser notifications for new triggers
      newTriggers.forEach(trigger => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Trading Alert: ${trigger.symbol}`, {
            body: trigger.message,
            icon: '/favicon.ico'
          })
        }
      })
    }
  }, [alertTriggers])

  const createAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newAlert.symbol && newAlert.threshold) {
      try {
        setLoading(true)
        await marketDataAPI.createAlertRule(
          newAlert.symbol.toUpperCase(),
          newAlert.type,
          newAlert.condition,
          parseFloat(newAlert.threshold)
        )
        
        // Reload alerts to show the new rule
        await loadAlerts()
        
        setNewAlert({ symbol: '', type: 'price_threshold', condition: 'above', threshold: '' })
        setShowCreateAlert(false)
      } catch (error) {
        console.error('Error creating alert:', error)
        alert('Failed to create alert. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const getConditionText = (alertType: AlertRule['alert_type'], condition: AlertRule['condition'], threshold: number): string => {
    if (alertType === 'price_threshold') {
      return `Price ${condition} $${threshold}`
    } else if (alertType === 'price_change') {
      return `Price change ${condition === 'above' ? '>' : '<'} ${threshold}%`
    } else if (alertType === 'volume_spike') {
      return `Volume spike ${threshold}x average`
    }
    return `${alertType}: ${threshold}`
  }

  const deleteAlert = async (ruleId: string) => {
    try {
      setLoading(true)
      await marketDataAPI.deleteAlertRule(ruleId)
      await loadAlerts()
    } catch (error) {
      console.error('Error deleting alert:', error)
      alert('Failed to delete alert. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Note: Toggle functionality would require backend API update
  // For now, we'll disable the toggle and only allow delete
  const toggleAlert = (ruleId: string) => {
    console.log('Toggle alert not implemented in backend yet:', ruleId)
  }

  const dismissNotification = (ruleId: string, triggeredAt: string) => {
    setActiveNotifications(prev => prev.filter(trigger => 
      !(trigger.rule_id === ruleId && trigger.triggered_at === triggeredAt)
    ))
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const activeAlertsCount = alertStats?.active_rules || 0
  const triggeredAlertsCount = alertStats?.recent_triggers || 0

  return (
    <div className="space-y-6">
      {/* Notifications Popup */}
      {activeNotifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {activeNotifications.slice(0, 3).map((notification) => (
            <div
              key={`${notification.rule_id}-${notification.triggered_at}`}
              className="bg-red-500 text-white p-4 rounded-lg shadow-lg border border-red-600 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-bold text-sm">{notification.symbol} Alert</div>
                  <div className="text-sm">{notification.message}</div>
                  <div className="text-xs opacity-90 mt-1">
                    {new Date(notification.triggered_at).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => dismissNotification(notification.rule_id, notification.triggered_at)}
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
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value as AlertRule['alert_type']})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="price_threshold">Price Threshold</option>
                  <option value="price_change">Price Change %</option>
                  <option value="volume_spike">Volume Spike</option>
                  <option value="technical_signal">Technical Signal</option>
                </select>
                
                {newAlert.type === 'price_threshold' && (
                  <select
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert({...newAlert, condition: e.target.value as AlertRule['condition']})}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
                )}

                <input
                  type="number"
                  step="0.01"
                  placeholder="Threshold Value"
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({...newAlert, threshold: e.target.value})}
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
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}
          
          <div className="space-y-3">
            {alertRules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No alerts configured. Create your first alert to get started.
              </div>
            ) : (
              alertRules.map((rule) => {
                const hasRecentTrigger = alertTriggers.some(trigger => trigger.rule_id === rule.id)
                return (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-lg border ${
                      hasRecentTrigger
                        ? 'bg-red-50 border-red-200' 
                        : rule.enabled
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="font-medium text-lg">{rule.symbol}</div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            hasRecentTrigger
                              ? 'bg-red-100 text-red-800' 
                              : rule.enabled
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {hasRecentTrigger ? 'Recently Triggered' : rule.enabled ? 'Active' : 'Disabled'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {getConditionText(rule.alert_type, rule.condition, rule.threshold)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {new Date(rule.created_at).toLocaleDateString()}
                          {rule.last_triggered && (
                            <span className="ml-3">
                              Last triggered: {new Date(rule.last_triggered).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {hasRecentTrigger && (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <button
                          onClick={() => deleteAlert(rule.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                          title="Delete Alert"
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
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
            {alertTriggers
              .slice(0, 10)
              .map((trigger) => (
                <div
                  key={`${trigger.rule_id}-${trigger.triggered_at}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <BellRing className="h-4 w-4 text-red-600" />
                    <div>
                      <div className="font-medium text-sm">{trigger.symbol} - {trigger.message}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(trigger.triggered_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              ))}
            
            {alertTriggers.length === 0 && (
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