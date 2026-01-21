import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserDashboardLayout from './UserDashboardLayout';

const initialNotifications = [
  {
    id: '1',
    type: 'test',
    title: 'New Test Available',
    message: 'MPSC Prelims Mock Test 5 is now available. Attempt before the deadline!',
    timestamp: '2024-06-25T10:30:00',
    read: false,
    priority: 'high',
  },
  {
    id: '2',
    type: 'result',
    title: 'Test Result Published',
    message: 'Your result for UPSC General Studies Paper 1 is now available.',
    timestamp: '2024-06-24T15:45:00',
    read: false,
    priority: 'medium',
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Test Reminder',
    message: 'You have an incomplete test: UPSC History Mock Test. Complete it before it expires.',
    timestamp: '2024-06-24T09:00:00',
    read: true,
    priority: 'medium',
  },
  {
    id: '4',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on June 26th from 2:00 AM to 4:00 AM IST.',
    timestamp: '2024-06-23T18:30:00',
    read: true,
    priority: 'low',
  },
  // New notifications:
  {
    id: '5',
    type: 'reminder',
    title: 'Upcoming Exam Reminder',
    message: 'Your UPSC Mains Exam is scheduled for 30th June. Don’t forget to revise!',
    timestamp: '2024-06-27T09:00:00',
    read: false,
    priority: 'high',
  },
  {
    id: '6',
    type: 'system',
    title: 'Complete Your Profile',
    message: 'Your profile is incomplete. Please update your details to get personalized recommendations.',
    timestamp: '2024-06-26T12:00:00',
    read: false,
    priority: 'medium',
  },
  {
    id: '7',
    type: 'system',
    title: 'New Study Material Available',
    message: 'New notes for "Indian Polity" have been added to your library.',
    timestamp: '2024-06-25T18:00:00',
    read: true,
    priority: 'low',
  },
  {
    id: '8',
    type: 'result',
    title: 'Leaderboard Update',
    message: 'You have moved up to Rank 5 on the Leaderboard. Keep it up!',
    timestamp: '2024-06-25T20:00:00',
    read: true,
    priority: 'medium',
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'test': return 'book-outline';
    case 'result': return 'trophy-outline';
    case 'reminder': return 'alarm-outline';
    case 'system': return 'settings-outline';
    default: return 'notifications-outline';
  }
};

const getNotificationColor = (type: string, priority: string) => {
  if (priority === 'high') return '#dc2626';
  switch (type) {
    case 'test': return '#4f46e5';
    case 'result': return '#059669';
    case 'reminder': return '#f97316';
    case 'system': return '#6b7280';
    default: return '#6b7280';
  }
};

const formatNotificationTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 800;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <UserDashboardLayout title="Notifications" activeLabel="Notifications">
      <View style={styles.container}>
        <View style={{ width: '100%', alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8, backgroundColor: '#f8fafc' }}>
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
            <Ionicons name="checkmark-done-outline" size={18} color="#4f46e5" />
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={[styles.grid, !isMobile && { flexDirection: 'row', flexWrap: 'wrap', gap: 16 }]}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No Notifications</Text>
            </View>
          ) : (
            notifications.map((n, idx) => (
              <TouchableOpacity
                key={n.id}
                style={[
                  styles.card,
                  !isMobile && { width: '48%' },
                  n.read ? styles.readCard : styles.unreadCard,
                ]}
                onPress={() => markAsRead(n.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconCircle, { backgroundColor: getNotificationColor(n.type, n.priority) + '20' }]}>
                  <Ionicons name={getNotificationIcon(n.type)} size={24} color={getNotificationColor(n.type, n.priority)} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, !n.read && styles.unreadTitle]}>{n.title}</Text>
                  <Text style={styles.cardMsg}>{n.message}</Text>
                  <Text style={styles.cardTime}>{formatNotificationTime(n.timestamp)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  markAllText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  grid: {
    padding: 20,
    paddingTop: 8,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#6366f1',
    minHeight: 80,
  },
  unreadCard: {
    borderLeftColor: '#dc2626',
    backgroundColor: '#fff5f5',
    borderLeftWidth: 6,
  },
  readCard: {
    backgroundColor: '#f5f8ff',
    opacity: 0.85,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    lineHeight: 22,
  },
  unreadTitle: {
    color: '#1e293b',
    fontWeight: '800',
  },
  cardMsg: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 21,
  },
  cardTime: {
    fontSize: 13,
    color: '#a1a1aa',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 17,
    color: '#64748b',
    marginTop: 16,
  },
});

export default Notifications;