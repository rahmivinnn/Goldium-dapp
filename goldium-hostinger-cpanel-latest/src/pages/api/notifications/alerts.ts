import type { NextApiRequest, NextApiResponse } from 'next';
import { PublicKey } from '@solana/web3.js';

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

interface ApiResponse {
  success: boolean;
  data?: {
    notifications: SystemNotification[];
    priceAlerts: PriceAlert[];
    settings: NotificationSettings;
    unreadCount: number;
  };
  error?: string;
}

// Mock data generators
function generateMockNotifications(userId: string): SystemNotification[] {
  const notifications: SystemNotification[] = [
    {
      id: '1',
      type: 'SUCCESS',
      title: 'Transaction Confirmed',
      message: 'Your swap of 10 SOL to GOLD has been confirmed successfully.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'MEDIUM',
      category: 'TRANSACTION',
      actionUrl: '/transactions',
      actionText: 'View Transaction'
    },
    {
      id: '2',
      type: 'INFO',
      title: 'Price Alert Triggered',
      message: 'SOL has reached your target price of $105.00',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'HIGH',
      category: 'PRICE',
      actionUrl: '/trading',
      actionText: 'Trade Now'
    },
    {
      id: '3',
      type: 'WARNING',
      title: 'High Network Congestion',
      message: 'Solana network is experiencing high congestion. Transactions may take longer.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'MEDIUM',
      category: 'SYSTEM'
    },
    {
      id: '4',
      type: 'INFO',
      title: 'Staking Rewards Available',
      message: 'You have earned 0.25 SOL in staking rewards. Claim now!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'MEDIUM',
      category: 'TRANSACTION',
      actionUrl: '/staking',
      actionText: 'Claim Rewards'
    },
    {
      id: '5',
      type: 'SUCCESS',
      title: 'Security Update',
      message: 'Your account security settings have been updated successfully.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'LOW',
      category: 'SECURITY'
    }
  ];

  return notifications;
}

function generateMockPriceAlerts(userId: string): PriceAlert[] {
  return [
    {
      id: 'alert1',
      userId,
      token: 'SOL',
      condition: 'ABOVE',
      targetPrice: 105.00,
      currentPrice: 102.50,
      isActive: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'alert2',
      userId,
      token: 'GOLD',
      condition: 'BELOW',
      targetPrice: 0.10,
      currentPrice: 0.12,
      isActive: true,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'alert3',
      userId,
      token: 'BTC',
      condition: 'ABOVE',
      targetPrice: 50000,
      currentPrice: 45000,
      isActive: false,
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      triggeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ];
}

function generateMockSettings(userId: string): NotificationSettings {
  return {
    userId,
    emailNotifications: true,
    pushNotifications: true,
    priceAlerts: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyReports: true
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === 'GET') {
    try {
      const { address } = req.query;

      if (!address || typeof address !== 'string') {
        return res.status(400).json({ success: false, error: 'Wallet address is required' });
      }

      // Validate Solana address
      try {
        new PublicKey(address);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid Solana address' });
      }

      const notifications = generateMockNotifications(address);
      const priceAlerts = generateMockPriceAlerts(address);
      const settings = generateMockSettings(address);
      const unreadCount = notifications.filter(n => !n.isRead).length;

      res.status(200).json({
        success: true,
        data: {
          notifications,
          priceAlerts,
          settings,
          unreadCount
        }
      });
    } catch (error) {
      console.error('Notifications fetch error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { address, action, notificationId, alertData, settingsData } = req.body;

      if (!address) {
        return res.status(400).json({ success: false, error: 'Wallet address is required' });
      }

      // Validate Solana address
      try {
        new PublicKey(address);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid Solana address' });
      }

      switch (action) {
        case 'markAsRead':
          if (!notificationId) {
            return res.status(400).json({ success: false, error: 'Notification ID is required' });
          }
          // In a real app, update the notification in database
          res.status(200).json({ 
            success: true, 
            data: { 
              notifications: generateMockNotifications(address), 
              priceAlerts: generateMockPriceAlerts(address), 
              settings: generateMockSettings(address), 
              unreadCount: 0 
            } 
          });
          break;

        case 'createPriceAlert':
          if (!alertData || !alertData.token || !alertData.targetPrice || !alertData.condition) {
            return res.status(400).json({ success: false, error: 'Alert data is incomplete' });
          }
          // In a real app, save the alert to database
          const newAlert: PriceAlert = {
            id: `alert_${Date.now()}`,
            userId: address,
            token: alertData.token,
            condition: alertData.condition,
            targetPrice: alertData.targetPrice,
            currentPrice: alertData.currentPrice || 0,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          res.status(201).json({ 
            success: true, 
            data: { 
              notifications: generateMockNotifications(address), 
              priceAlerts: [...generateMockPriceAlerts(address), newAlert], 
              settings: generateMockSettings(address), 
              unreadCount: 0 
            } 
          });
          break;

        case 'updateSettings':
          if (!settingsData) {
            return res.status(400).json({ success: false, error: 'Settings data is required' });
          }
          // In a real app, update settings in database
          res.status(200).json({ 
            success: true, 
            data: { 
              notifications: generateMockNotifications(address), 
              priceAlerts: generateMockPriceAlerts(address), 
              settings: { ...generateMockSettings(address), ...settingsData }, 
              unreadCount: 0 
            } 
          });
          break;

        case 'deleteAlert':
          if (!notificationId) {
            return res.status(400).json({ success: false, error: 'Alert ID is required' });
          }
          // In a real app, delete the alert from database
          res.status(200).json({ 
            success: true, 
            data: { 
              notifications: generateMockNotifications(address), 
              priceAlerts: generateMockPriceAlerts(address).filter(alert => alert.id !== notificationId), 
              settings: generateMockSettings(address), 
              unreadCount: 0 
            } 
          });
          break;

        default:
          res.status(400).json({ success: false, error: 'Invalid action' });
      }
    } catch (error) {
      console.error('Notifications action error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}