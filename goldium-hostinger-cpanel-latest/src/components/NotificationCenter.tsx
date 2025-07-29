import { FC, useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notify } from '../utils/notifications';

interface PriceAlert {
  id: string;
  userId: string;
  token: string;
  condition: 'ABOVE' | 'BELOW';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

interface SystemNotification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'SYSTEM' | 'TRANSACTION' | 'PRICE' | 'SECURITY' | 'UPDATE';
  actionUrl?: string;
  actionText?: string;
}

interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  priceAlerts: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
}

interface NotificationData {
  notifications: SystemNotification[];
  priceAlerts: PriceAlert[];
  settings: NotificationSettings;
  unreadCount: number;
}

export const NotificationCenter: FC = () => {
  const { publicKey } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts' | 'settings'>('notifications');
  const [data, setData] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    token: 'SOL',
    condition: 'ABOVE' as 'ABOVE' | 'BELOW',
    targetPrice: ''
  });

  const fetchNotifications = useCallback(async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/notifications/alerts?address=${publicKey.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        notify({ type: 'error', message: result.error || 'Failed to fetch notifications' });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      notify({ type: 'error', message: 'Failed to fetch notifications' });
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (publicKey && isOpen) {
      fetchNotifications();
    }
  }, [publicKey, isOpen, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    if (!publicKey) return;

    try {
      const response = await fetch('/api/notifications/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: publicKey.toString(),
          action: 'markAsRead',
          notificationId
        })
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const createPriceAlert = async () => {
    if (!publicKey || !newAlert.targetPrice) return;

    try {
      const response = await fetch('/api/notifications/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: publicKey.toString(),
          action: 'createPriceAlert',
          alertData: {
            token: newAlert.token,
            condition: newAlert.condition,
            targetPrice: parseFloat(newAlert.targetPrice)
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        notify({ type: 'success', message: 'Price alert created successfully!' });
        setShowCreateAlert(false);
        setNewAlert({ token: 'SOL', condition: 'ABOVE', targetPrice: '' });
        fetchNotifications();
      } else {
        notify({ type: 'error', message: result.error || 'Failed to create alert' });
      }
    } catch (error) {
      console.error('Error creating price alert:', error);
      notify({ type: 'error', message: 'Failed to create price alert' });
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!publicKey) return;

    try {
      const response = await fetch('/api/notifications/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: publicKey.toString(),
          action: 'deleteAlert',
          notificationId: alertId
        })
      });

      if (response.ok) {
        notify({ type: 'success', message: 'Alert deleted successfully!' });
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      notify({ type: 'error', message: 'Failed to delete alert' });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return '✅';
      case 'WARNING': return '⚠️';
      case 'ERROR': return '❌';
      case 'INFO': return 'ℹ️';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'border-red-500 bg-red-500/10';
      case 'MEDIUM': return 'border-yellow-500 bg-yellow-500/10';
      case 'LOW': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  if (!publicKey) {
    return null;
  }

  return (
    <>
      {/* Notification Bell */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg bg-gray-800/50 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 animate-pulse-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {data && data.unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-twinkle"
          >
            {data.unreadCount > 9 ? '9+' : data.unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-4 top-20 w-96 h-[600px] bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl z-50 animate-morphing"
            >
              {/* Header */}
              <div className="p-4 border-b border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white animate-shimmer">Notification Center</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
                  {['notifications', 'alerts', 'settings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
                        activeTab === tab
                          ? 'bg-purple-600 text-white animate-cyber-pulse'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <>
                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                      <div className="space-y-3">
                        {data?.notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-lg border ${getPriorityColor(notification.priority)} ${
                              !notification.isRead ? 'ring-2 ring-purple-500/30' : ''
                            } animate-hologram`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                              <div className="flex-1">
                                <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                                <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                  </span>
                                  {!notification.isRead && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-xs text-purple-400 hover:text-purple-300"
                                    >
                                      Mark as read
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Price Alerts Tab */}
                    {activeTab === 'alerts' && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-white">Price Alerts</h4>
                          <button
                            onClick={() => setShowCreateAlert(true)}
                            className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none animate-cyber-pulse"
                          >
                            + Add Alert
                          </button>
                        </div>

                        {/* Create Alert Modal */}
                        {showCreateAlert && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-800/90 p-4 rounded-lg border border-purple-500/30 animate-morphing"
                          >
                            <h5 className="font-medium text-white mb-3">Create Price Alert</h5>
                            <div className="space-y-3">
                              <select
                                value={newAlert.token}
                                onChange={(e) => setNewAlert({ ...newAlert, token: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                              >
                                <option value="SOL">SOL</option>
                                <option value="GOLD">GOLD</option>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                              </select>
                              <select
                                value={newAlert.condition}
                                onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as 'ABOVE' | 'BELOW' })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                              >
                                <option value="ABOVE">Above</option>
                                <option value="BELOW">Below</option>
                              </select>
                              <input
                                type="number"
                                placeholder="Target Price"
                                value={newAlert.targetPrice}
                                onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={createPriceAlert}
                                  className="flex-1 btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none"
                                >
                                  Create
                                </button>
                                <button
                                  onClick={() => setShowCreateAlert(false)}
                                  className="flex-1 btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-none"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Alerts List */}
                        {data?.priceAlerts.map((alert) => (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-lg border ${
                              alert.isActive ? 'border-green-500/30 bg-green-500/10' : 'border-gray-500/30 bg-gray-500/10'
                            } animate-hologram`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-white text-sm">
                                  {alert.token} {alert.condition.toLowerCase()} ${alert.targetPrice}
                                </h5>
                                <p className="text-xs text-gray-400">
                                  Current: ${alert.currentPrice} • {alert.isActive ? 'Active' : 'Triggered'}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteAlert(alert.id)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-white">Notification Settings</h4>
                        {data?.settings && (
                          <div className="space-y-3">
                            {Object.entries(data.settings).map(([key, value]) => {
                              if (key === 'userId') return null;
                              return (
                                <div key={key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg animate-hologram">
                                  <span className="text-sm text-gray-300 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={value as boolean}
                                    className="toggle toggle-purple toggle-sm"
                                    readOnly
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};